module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary", // o 'local'
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      breakpoints: {
        xlarge: 1920, // tu nuevo tamaño
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 150,
      },
    },
  },
});
