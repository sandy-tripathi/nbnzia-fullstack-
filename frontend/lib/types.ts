export interface Project {
  _id: string;
  name: string;
  description: string;
  href: string;
  imageUrl: string;
  bg: string;
  textDark: boolean;
  order: number;
  published: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  published: boolean;
}

export type ContactStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    unreadCount: number;
  };
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string } | string>;
}
