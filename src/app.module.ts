import { Module } from '@nestjs/common';
import { UsersModule } from './domains/users/users.module';
import { AlbumsModule } from './domains/albums/albums.module';
import { ArtistsModule } from './domains/artists/artists.module';
import { FavoritesModule } from './domains/favorites/favorites.module';
import { TracksModule } from './domains/tracks/tracks.module';
import { DbModule } from './db/db.module';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';

@Module({
  imports: [
    ConfigurationModule,
    DbModule,
    UsersModule,
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,
    TracksModule,
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
