export const URL_REGEX: RegExp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
export const YOUTUBE_URL_REGEX: RegExp =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;
export const DOT_BE_ID_REGEX: RegExp =
  /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|.*[?&]vi=)([^"&?\/\s]{11})/;
export const DOT_COM_ID_REGEX: RegExp =
  /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|.*[?&]vi=)([^"&?\/\s]{11})/;
