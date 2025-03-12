export interface UpdateBlogPost{
    title: string,
    shortDescription: string,
    content: string,
    featureImageUrl: string,
    urlHandle: string,
    dateCreated: Date,
    author: string,
    isVisible: boolean,
    categories: string[]
}