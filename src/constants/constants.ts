export const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const FILE_UPLOADS_DIR = 'public';

export const MAX_IMAGES_ALLOWED = 10;

export const SWAGGER_SUPERHEROES_POST_BODY = {
  schema: {
    type: 'object',
    properties: {
      nickname: { type: 'string' },
      realName: { type: 'string' },
      originDescription: { type: 'string' },
      superpowers: { type: 'string' },
      catchPhrase: { type: 'string' },

      avatar: {
        type: 'string',
        format: 'binary',
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};

export const SWAGGER_SUPERHERO_PATCH_BODY = {
  schema: {
    type: 'object',
    properties: {
      nickname: { type: 'string' },
      realName: { type: 'string' },
      originDescription: { type: 'string' },
      superpowers: { type: 'string' },
      catchPhrase: { type: 'string' },
      deleteAvatar: { type: 'boolean' },

      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const SWAGGER_IMAGE_DELETE_BODY = {
  schema: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
  },
};

export const SWAGGER_IMAGE_POST_BODY = {
  schema: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};
