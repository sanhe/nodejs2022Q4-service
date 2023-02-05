import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { DbService } from '../../db/db.service';
import { OutputFavoritesDto } from './dto/output-favorites.dto';
import { generateUuid } from '../../common/uuid';
import { AlbumEntityInterface } from '../albums/interfaces/album.entity.interface';
import { TrackEntity } from '../tracks/entities/track.entity';
import { AlbumEntity } from '../albums/entities/album.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { FavoriteEntity } from './entities/favorite.entity';
import { NotInFavoritesError } from './errors/not-in-favorites.error';

@Injectable()
export class FavoritesService {
  constructor(private readonly dbService: DbService) {}

  async findAll(): Promise<OutputFavoritesDto> {
    const favorites = await this.dbService.db.favorites.findAll();

    if (!favorites) {
      return new OutputFavoritesDto();
    }

    const favorite = favorites[0];
    const artists = await this.dbService.db.artists.findByIds(favorite.artists);
    const albums = await this.dbService.db.albums.findByIds(favorite.albums);
    const tracks = await this.dbService.db.tracks.findByIds(favorite.tracks);

    const outputFavorites = new OutputFavoritesDto(artists, albums, tracks);

    return outputFavorites;
  }

  async createEmptyFavorite(): Promise<FavoriteEntity> {
    const favorite = {
      id: generateUuid(),
      artists: [],
      albums: [],
      tracks: [],
    };

    await this.dbService.db.favorites.add(favorite);

    return favorite;
  }

  async getFavorite(): Promise<FavoriteEntity> {
    let favorites = await this.dbService.db.favorites.findAll();

    if (!favorites) {
      favorites = await this.createEmptyFavorite();
    }

    return favorites[0];
  }

  async addTrack(trackId: string) {
    const favorite = await this.getFavorite();

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      tracks: [...favorite.tracks, trackId],
    });
  }

  async removeTrack(trackId: string) {
    const favorite = await this.getFavorite();

    const favoriteTrackIndex = favorite.tracks.findIndex(
      (id) => id === trackId,
    );

    if (favoriteTrackIndex === -1) {
      throw new NotInFavoritesError();
    }

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      tracks: favorite.tracks.slice(favoriteTrackIndex, 1),
    });
  }

  async addAlbum(albumId: string) {
    const favorite = await this.getFavorite();

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      albums: [...favorite.albums, albumId],
    });
  }

  async removeAlbum(albumId: string) {
    const favorite = await this.getFavorite();

    const favoriteAlbumIndex = favorite.albums.findIndex(
      (id) => id === albumId,
    );

    if (favoriteAlbumIndex === -1) {
      throw new NotInFavoritesError();
    }

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      albums: favorite.albums.slice(favoriteAlbumIndex, 1),
    });
  }

  async addArtist(artistId: string) {
    const favorite = await this.getFavorite();

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      artists: [...favorite.artists, artistId],
    });
  }

  async removeArtist(artistId: string) {
    const favorite = await this.getFavorite();

    const favoriteArtistIndex = favorite.artists.findIndex(
      (id) => id === artistId,
    );

    if (favoriteArtistIndex === -1) {
      throw new NotInFavoritesError();
    }

    await this.dbService.db.favorites.update(favorite.id, {
      ...favorite,
      artists: favorite.artists.slice(favoriteArtistIndex, 1),
    });
  }
}
