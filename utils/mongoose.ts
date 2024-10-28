import {Document, PipelineStage, Schema} from 'mongoose';

interface PaginateOptions {
    page?: number;
    limit?: number;
    sort?: any;
    populate?: any;
    select?: any;
}

interface AggregatePaginateOptions {
    page?: number;
    limit?: number;
    sort?: any;
}

interface PaginateResult<T extends Document> {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    docs: T[];
}

function paginate<T extends Document>(schema: Schema) {
    schema.statics.paginate = async function (filters: any = {}, options: PaginateOptions = {}): Promise<PaginateResult<T>> {
        let page = +options.page || 1
        let limit = +options.limit || 10
        const skip = (page - 1) * limit;
        const totalDocs = await this.countDocuments(filters);
        const totalPages = Math.ceil(totalDocs / limit);
        let query = this.find(filters, options.select)
        if (options.sort) {
            query.sort(options.sort)
        }
        if (options.populate) {
            query.populate(options.populate)
        }
        const docs = await query.skip(skip).limit(limit);
        return {
            page,
            limit,
            totalDocs,
            totalPages,
            docs,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    };
}


function aggregatePaginate<T extends Document>(schema: Schema) {
    schema.statics.aggregatePaginate = async function (pipeline: [PipelineStage], options: AggregatePaginateOptions = {}, after?: [PipelineStage]): Promise<PaginateResult<T>> {
        let page = +options.page || 1
        let limit = +options.limit || 10
        const skip = (page - 1) * limit;
        const result = await this.aggregate([
            ...pipeline,
            ...(options.sort ? [{$sort: options.sort}] : []),
            {
                $facet: {
                    docs: [
                        {$skip: skip},
                        {$limit: limit},
                        ...(after || [])
                    ],
                    totalDocs: [
                        {$count: 'count'}
                    ],
                }
            },
            {
                $project: {
                    docs: 1,
                    totalDocs: {$arrayElemAt: ['$totalDocs.count', 0]},
                    page: {$literal: page},
                    limit: {$literal: limit},
                    hasPrevPage: {$cond: [{$gt: [page, 1]}, true, false]},
                    totalPages: {$ceil: {$divide: [{$arrayElemAt: ['$totalDocs.count', 0]}, Number(limit)]}}
                }
            },
            {
                $addFields: {
                    hasNextPage: {$cond: [{$lt: ['$page', '$totalPages']}, true, false]},
                    hasPrevPage: {$cond: [{$gt: ['$page', 1]}, true, false]}
                }
            }
        ])
        return result[0]
    };
}


declare module 'mongoose' {
    // @ts-ignore
    interface Model<T extends Document> {
        paginate(filters: any, options: PaginateOptions): Promise<PaginateResult<T>>;
        aggregatePaginate(pipeline: [PipelineStage], options: AggregatePaginateOptions, after?: [PipelineStage]): Promise<PaginateResult<T>>;
    }
}

export {paginate, aggregatePaginate}