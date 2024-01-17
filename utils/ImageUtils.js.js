import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import firebase from '../config';

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};

export const imageToBlob = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  return blob;
};

export const uploadImageLocalToFirebaseStorage = async (uriLocal, ref, key) => {
  const blob = await imageToBlob(uriLocal);
  const storage = firebase.storage();
  //const ref_mesimages = storage.ref("MesImages");
  const ref_images = storage.ref(ref);
  //const ref_image = ref_mesimages.child("image-" + key);
  const ref_image = ref_images.child("image-" + key);
  await ref_image.put(blob);
  const url = await ref_image.getDownloadURL();
  return url;
};
