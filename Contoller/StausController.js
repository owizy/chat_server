import StatusImages from "../Models/Status.js";

const getImages = async (req, res) => {
    try {
      let images = await StatusImages.find({}, " -__v");
      return res.status(200).json({ images, msg: "image info fetched"    });
    } catch (error) {
      console.error(error);
        return res.status(500).json({ error: "some error occured" });
      }
      };
  const uploadImage = async (req, res) => {
    try {
      if (req.file && req.file.path) {
        const image = new StatusImages({
       userId: req.body.userId,
        Images: req.file.path,
  });
  await image.save();
  return res.status(200).json({ msg: "image successfully saved" });
  } else {
    console.log(req.file);
    return res.status(422).json({ error: "invalid" });
      }
      } catch (error) {
    console.error(error);
   return res.status(500).json({ error: "some error occured" });
    }
  };
 
  
export {getImages , uploadImage}  