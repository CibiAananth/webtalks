export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  text: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
}

export interface RequestLogEntry {
  url: string;
  status: number;
  duration: number;
  timestamp: number;
}
