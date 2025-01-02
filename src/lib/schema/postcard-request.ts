export type PostcardRequest = {
  start: string;
  end: string;
  sender: string;
  recipient: string;
};

export type PostcardResponse = {
  description: string;
  image: string;
  map: string;
  story: string;
};
