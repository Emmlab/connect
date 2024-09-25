import { Client, Databases, Account, Users, Storage } from 'node-appwrite';

// appwrite admin client
const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
        .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY as string);

    return {
        get client() {
            return client
        },
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        }
    };
};

// appwrite session client
const createSessionClient = async (session: string) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

    if (session) {
        client.setSession(session);
    }

    return {
        get account() {
            return new Account(client);
        },

        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    };
};

export { createAdminClient, createSessionClient };