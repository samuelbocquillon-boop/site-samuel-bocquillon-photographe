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
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560778/photo_20_eutram.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560869/Pauline_Alexandre-153_yem5cn.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560986/1A297165-C093-4024-BF98-5C2CA9BA1791_1_105_c_jazlru.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560942/2D992224-831E-4489-B453-8EF86FDA3EF7_1_105_c_caliob.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560951/E20BB4CA-D056-4DFC-B640-7315F888AEA9_1_105_c_f5rsc4.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788560974/DCDAAE78-DB91-4B58-8574-CBDE3A8EAD9F_1_105_c_nodlgc.jpg",
    "https://res.cloudinary.com/dvsqwrbc3/image/upload/v1788561091/9C69A0B8-6181-48B4-93AB-4176F50E85B5_1_105_c_d7hhf2.jpg",
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
