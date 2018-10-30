import { Image,StyleSheet, Text, View } from "react-native";
import PhotoUpload from 'react-native-photo-upload';
import * as func from "../func/func";

const Portrait = props => {
  return (
    <PhotoUpload
        onPhotoSelect={avatar => {
            if (avatar) {
                //console.warn('Image base64 string: ', avatar);
                func
                .callApi("post", "api/upload_image", {image:avatar}, "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIyYmEzMTFmY2VhZGNhMTU0Y2M4MTRjYTlkOTk3ZDBkN2M1NWMxNDQ3OTFkMWJjN2Q4MmNlZjg3NTY2NzgzZjc1ZTA2OWIzZmVkZjZhNGRiIn0.eyJhdWQiOiIyIiwianRpIjoiYjJiYTMxMWZjZWFkY2ExNTRjYzgxNGNhOWQ5OTdkMGQ3YzU1YzE0NDc5MWQxYmM3ZDgyY2VmODc1NjY3ODNmNzVlMDY5YjNmZWRmNmE0ZGIiLCJpYXQiOjE1MzA0MjM4NTUsIm5iZiI6MTUzMDQyMzg1NSwiZXhwIjoxNTMwNzY5NDU1LCJzdWIiOiIyMiIsInNjb3BlcyI6W119.Q_v2hm6_Qw1QNQNrH_X67zmcPo1Gx0x84ANTeI3N1ijWOWFrvbtM0r3SrCgC-5y5OxG-VEiyi_PxSyr6tvL58yVHdqvNJbtUKmcspIs-ZiP60a6wGSsvIo-a3laliUN3n8ZyZ2oCPXOvlVldQdGiPsUOs8MXzSN_NtqrtEY_ZOR8ZmeNWk7hP195rmHSTGLHoWPHuou6gb1zod6uTUUDy_n9Ak3gUFA9kKbHaoYopf55zC2-2_bvMyrWVeDJQyZhy_Lbikzh-z2ljj532l2Zh0dhS63KSEGp64UFWuXeSFTDwyr-tE2UmYm2Ywx28_lszt8gnsy6VPIqjq7P8cNOOcRkS2_8BgzFY4YQpPpBjNsF3haYH-HyZ9lO9tQqikjE-EpWMM4wmHgxXK5ty56ga6hfxnMGr1p1akwsxZlNLLftYMdHc9XSj3ri6hF9j2SrYy3MFFR4HSf_QvNjxwqZxV429-x4YKpuI-IoiyldIS5re1YEVhBPDfe-rm6IIrAJiHdFfCy-jnlJoL5LqBQ7sOddr4lsf5b7Vlous-d8a4Uybb7hcgoKmJgYHsMyJGd6vCzkvANyx7UKUeS3mQ-MW6bUdwMh-bOviBzkZsdm6oX10Ul02vsJnJMUtbqp5taYnE-5a-xOH1fLE2GdPZJCfcL1uH8qKNKI5g99C44Eemg")
                .then(response => {
                    //console.warn(response.data);
                })
                .catch(error => {
                    //console.warn(error.response.data.message);
                });
            }
        }}
    >
        <Image
            style={{
                paddingVertical: 30,
                width: 150,
                height: 150,
                borderRadius: 75
            }}
            resizeMode='cover'
            source={{
                uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
            }}
        />
    </PhotoUpload>
  );
};

export default Portrait;
