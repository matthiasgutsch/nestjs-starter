import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corePathsExcludes } from '@tresdoce-nestjs-toolkit/core';
import { ExceptionsFilter } from '@tresdoce-nestjs-toolkit/filters';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  const appConfig = app.get<ConfigService>(ConfigService)['internalConfig']['config'];
  const { server, swagger, project } = appConfig;
  const port = parseInt(server.port, 10) || 8080;

  app.setGlobalPrefix(`${server.context}`, {
    exclude: corePathsExcludes,
  });

  app.use([cookieParser(), helmet(), compression()]);
  app.useGlobalFilters(new ExceptionsFilter(appConfig));

  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('class-transformer'),
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${project.name}`)
      .setVersion(`${project.version}`)
      .setDescription(`Swagger - ${project.description}`)
      .setExternalDoc('Documentation', project.homepage)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${swagger.path}`, app, document);
  }

  if (server.corsEnabled) {
    app.enableCors({
      origin: server.origins,
      allowedHeaders: `${server.allowedHeaders}`,
      methods: `${server.allowedMethods}`,
      credentials: server.corsCredentials,
    });
  }
  await app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
  });
}

bootstrap();
