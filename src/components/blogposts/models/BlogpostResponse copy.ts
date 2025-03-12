import { Category } from "../../categories/models/Category";

export interface BlogpostResponse{
    id : string,
    title: string,
    shortDescription: string,
    content: string,
    featureImageUrl: string,
    urlHandle: string,
    dateCreated: Date,
    author: string,
    isVisible: boolean,
    categories: Category[]
}