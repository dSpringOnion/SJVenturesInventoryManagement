import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toLowerCase() + modelName.slice(1);
  });

  // Reverse the order for deletion to handle dependencies
  for (const modelName of modelNames.reverse()) {
    const model = (prisma as any)[modelName];
    if (model && typeof model.deleteMany === "function") {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
          `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "location.json", // Seed locations first
    "user.json",     // Then seed users
    "vendor.json",
    "product.json",
    "productStockLevel.json",
    "invoice.json",
    "invoiceItem.json",
  ];

  await deleteAllData(orderedFileNames);

  // Seed Locations first
  const locationsFilePath = path.join(dataDirectory, "location.json");
  if (fs.existsSync(locationsFilePath)) {
    const locationsData = JSON.parse(fs.readFileSync(locationsFilePath, "utf-8"));
    for (const location of locationsData) {
      try {
        await prisma.location.create({
          data: location,
        });
      } catch (error) {
        console.error(`Error seeding Locations:`, error);
      }
    }
    console.log(`Seeded Locations with data from locations.json`);
  } else {
    console.error(`File not found: locations.json`);
  }

  // Seed Users with password hashing after locations
  const usersFilePath = path.join(dataDirectory, "users.json");
  if (fs.existsSync(usersFilePath)) {
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
    for (const user of usersData) {
      // Hash the password before seeding
      user.password = await bcrypt.hash(user.password, 10);
    }
    for (const user of usersData) {
      try {
        await prisma.user.create({
          data: user,
        });
      } catch (error) {
        console.error(`Error seeding Users:`, error);
      }
    }
    console.log(`Seeded Users with data from users.json`);
  } else {
    console.error(`File not found: users.json`);
  }

  // Seed the rest of the data
  for (const fileName of orderedFileNames.slice(2)) { // Start after users.json
    const filePath = path.join(dataDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${fileName}`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const prismaModelName =
        modelName.charAt(0).toLowerCase() + modelName.slice(1);

    const model = (prisma as any)[prismaModelName];

    if (model && typeof model.createMany === "function") {
      try {
        await model.createMany({
          data: jsonData,
        });
        console.log(`Seeded ${modelName} with data from ${fileName}`);
      } catch (error) {
        console.error(`Error seeding ${modelName}:`, error);
      }
    } else {
      console.error(
          `Model ${modelName} not found or createMany not supported. Please ensure the model name is correctly specified.`
      );
    }
  }
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });