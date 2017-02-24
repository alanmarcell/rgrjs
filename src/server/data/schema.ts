import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} from 'graphql';

import{
    globalIdField,
    fromGlobalId,
    nodeDefinitions,
    connectionDefinitions,
    connectionArgs,
    connectionFromPromisedArray,
    mutationWithClientMutationId
} from 'graphql-relay';

function Schema(db){
    
    var counter = 42;
    var data = [42, 43, 44];

    var counters = [{counter: 42}, {counter: 43}];
    var counterType = new GraphQLObjectType({
        name: 'Counter',
        fields: () => ({
            counter: {type: GraphQLInt}
        })
    });

    class Store {}
    var store = new Store();

    var nodeDefs = nodeDefinitions(
        (globalId) => {
            let {type} = fromGlobalId(globalId);
            if(type === 'Store'){
                return store;
            }
            return null;
        },
        (obj) => {
            if(obj instanceof Store){
                return storeType;
            }
            return null;
        }
    );

    var linkType = new GraphQLObjectType({
        name: 'Link',
        fields: () => ({
            id: {
                type: new GraphQLNonNull(GraphQLID),
                resolve: (obj) => obj._id
            },
            title: {type: GraphQLString},
            url: { type: GraphQLString},
            createdAt: {
                type: GraphQLString,
                resolve: (obj) => new Date(obj.createdAt).toISOString()
            }
        })
    });

    var linkConnection = connectionDefinitions({
        name: 'Link',
        nodeType: linkType
    });

    var storeType = new GraphQLObjectType({
        name: 'Store',
        fields: () => ({
            id: globalIdField('Store'),
            linkConnection: {
                type: linkConnection.connectionType,
                args: {
                   ...connectionArgs,
                   query: {type: GraphQLString }
                },
                resolve: (_, args) =>{ 
                    var findParams = {};
                    if(args.query){
                        findParams.title = new RegExp(args.query, 'i')
                    }
                    console.log('limit', args.first);
                    return connectionFromPromisedArray( 
                        db.collection('links')
                            .find(findParams)
                            .sort({createdAt: -1})
                            .limit(args.first).toArray(),
                    args
                );
                }
            }
        }),
        interfaces: [nodeDefs.nodeInterface]
    });

    var createLinkMutation = mutationWithClientMutationId({
        name: 'CreateLink',
        
        inputFields: {
            title: {type: new GraphQLNonNull(GraphQLString)},
            url:  {type: new GraphQLNonNull(GraphQLString)}            
        },
        
        outputFields:{
            linkEdge: {
                type: linkConnection.edgeType,
                resolve: (obj) => ({node: obj.ops[0], cursor: obj.insertedId})
            },
            store:{
                type: storeType,
                resolve: () => store
            }
        },
        
        mutateAndGetPayload: ({title, url}) => {
            return db.collection('links').insertOne({
                title, 
                url,
                createdAt: Date.now()
            });
        }
    });

    var schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: () => ({           
                node: nodeDefs.nodeField,
                store:{
                    type: storeType,
                    resolve: () => store
                },
                counter:{
                    type: GraphQLInt,
                    resolve: ()=> counter
                },
                message:{
                    type: GraphQLString,
                    resolve: ()=> "Hello GraphQL!"            
                },
                data: {
                    type: new GraphQLList(GraphQLInt),
                    resolve: () => data            
                },
                counters: {
                    type: new GraphQLList(counterType),
                    resolve: () => counters
                },
                links:{
                    type: new GraphQLList(linkType),
                    resolve: () => db.collection('links').find({}).toArray()
                }
            })
        }),

        mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: () => ({
                /*Breaks the createLink
                 * incrementCounter: {
                    type: GraphQLInt,
                    resolve: () => ++counter
                },*/
                createLink: createLinkMutation
            })
        })    
    });

    return schema;
}

export default Schema;
