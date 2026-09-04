import os, asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

URLS = [
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788558657/photo_-_2024-12-30T205027.424_pnu4w4.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788558828/AFTER_DAY_-_Alpe_d_Huez-29_dqaoa3.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788558657/Shooting_inspiration_-_Cha%CC%82teau_d_aubry-387_ucq4n1.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560705/Ingrid_Jean-Marie-158_ndmv5g.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560716/06082022-_DSC5160_hbqlue.jpg",
]

async def main():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    docs = await db.gallery.find().sort('order', 1).to_list(1000)
    print("Total gallery items:", len(docs))
    for i, url in enumerate(URLS):
        target = docs[i]
        await db.gallery.update_one({'id': target['id']}, {'$set': {'url': url}})
        print(f"Position {i+1} (id={target['id']}) -> {url.split('/')[-1]}")
    client.close()

asyncio.run(main())
