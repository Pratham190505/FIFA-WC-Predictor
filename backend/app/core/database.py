from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import ssl

client: AsyncIOMotorClient = None
db:     AsyncIOMotorDatabase = None


async def connect_db():
    global client, db
    print(f"Connecting to MongoDB Atlas...")

    # Fix for Python 3.10 SSL issue on Windows
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tls=True,
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000,
    )

    db = client[settings.DATABASE_NAME]

    # Test connection before creating indexes
    await client.admin.command("ping")
    print("✅ MongoDB ping successful")

    # Create indexes
    await db["users"].create_index("email",    unique=True)
    await db["users"].create_index("username", unique=True)
    await db["predictions"].create_index("user_id")
    await db["predictions"].create_index("created_at")

    print(f"✅ Connected to MongoDB — database: {settings.DATABASE_NAME}")


async def disconnect_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    return db