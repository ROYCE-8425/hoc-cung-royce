import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { isCorsOriginAllowed } from './common/config/cors-origins';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe webhooks
  });

  // Increase payload size limit to 50MB
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);

  // API prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // CORS uses an explicit whitelist because auth requests include credentials.
  app.enableCors({
    origin: (origin, callback) => {
      if (isCorsOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hoc cung Royce API')
    .setDescription('Hoc cung Royce AI-powered learning platform API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Health', 'Health check endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Study Sets', 'Study set management')
    .addTag('Documents', 'Document management')
    .addTag('Flashcards', 'Flashcard management with SRS')
    .addTag('Knowledge Base', 'RAG knowledge base')
    .addTag('Chat', 'RAG-powered chat')
    .addTag('Quiz', 'AI-generated quizzes')
    .addTag('Exam Clone', 'Exam style cloning')
    .addTag('Problem Solver', 'Multi-agent problem solving')
    .addTag('Knowledge Graph', 'Entity-relation mapping')
    .addTag('Teach-Back', 'Feynman technique evaluation')
    .addTag('Research', 'Deep research mode')
    .addTag('Code Sandbox', 'Python code execution')
    .addTag('Learning Paths', 'AI-generated study routes')
    .addTag('Subscription', 'Stripe billing')
    .addTag('Analytics', 'Usage analytics')
    .addTag('Notifications', 'Notification management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = configService.get<number>('PORT', 3010);
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
  logger.log('WebSocket server ready');
}

bootstrap();
