const cloudinary = require("cloudinary").v2;// Configure Cloudinary
cloudinary.config({
	cloud_name: "dmhrmybf6",
	api_key: "858212211344114",
	api_secret: "zqWfwDJQ3oNTwI_4eLtXccLqYFM"
});


export const CloudinaryUpload = async (imagePath: string) => {
	console.log("<=====cloudinary api called=====>");
	try {
		const result = await cloudinary.uploader.upload(imagePath);
		console.log("------>result", result.url);
		return result.url;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Error uploading image");
	}
};