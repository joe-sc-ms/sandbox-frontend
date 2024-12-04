export interface IMessage {
  role: string;
  content: string;
}

export interface IThought {
  title: string;
  description: string;
}

export interface IGroundingData {
  id: string;
  content: string;
  filepath: string;
  title: string;
  url: string;
}

export interface IContext {
  thoughts: IThought[];
  grounding_data: IGroundingData[][];
}

export interface IResponse {
  message: IMessage;
  context: IContext;
}
