import { Document, model, Schema } from "mongoose";


type TArticle = Document & {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    coAuthors: Schema.Types.ObjectId[];
    relatedArticles: Schema.Types.ObjectId[];
    tags: string[];
    readTime: number;
    isPublished: boolean;
}


const ArticleSchema = new Schema<TArticle>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxLength: 300
    },
    collection_id: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
        index: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    coAuthors: [{
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }],
    relatedArticles: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    tags: [String],
    readTime: {
        type: Number,  // in minutes
        default: 5
    },
    isPublished: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

export const Article = model('Article', ArticleSchema);