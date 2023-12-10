import {
  DOT_BE_ID_REGEX,
  DOT_COM_ID_REGEX,
  YOUTUBE_URL_REGEX,
} from './consts.helper';

export const validateUrl = (url: string): boolean => {
  const regEx: RegExp = YOUTUBE_URL_REGEX;
  if (url.match(regEx)) {
    return true;
  }
  return false;
};

export const getVideoId = (url: string): string => {
  if (url.includes('youtu.be')) {
    return url.match(DOT_BE_ID_REGEX)![1];
  }
  if (url.includes('?v=')) {
    return url.match(DOT_COM_ID_REGEX)![1];
  }
  return '';
};
