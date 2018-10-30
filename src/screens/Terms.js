import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import Closer from "../components/Closer";
import * as func from "../func/func";

class Terms extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  render() {
    return (
      <ImageBackground style={styles.imageBackground} source={require("../img/bg3.jpeg")}>
        <Closer color={"#222"} onPress={func.debounce(()=>this.props.navigation.goBack())}/>
        <View style={styles.title}><Text style={styles.titleText}>Terms & Conditions</Text></View>
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Text>
                    
{"\n"}Qooka Mobile Applications End User License Agreement
{"\n"}
{"\n"}1. Introduction
{"\n"}
{"\n"}This End User Licence Agreement ("Terms") sets out the terms of licence and use that apply to those applications for use on mobile devices (such as mobile phones, tablets and other devices) that we make available for download from any third party application store (collectively, "Applications"):
{"\n"}
{"\n"}The Applications are provided by Qooka (ABN 86 785 324 172), a business registered in Tasmania, Australia.
{"\n"}
{"\n"}Your ordering and purchase of any of the food and other products offered on or through any Application ("Food Products") and submission of any personal information through the Application (eg. if you create an account to order Food Products) is subject to Qooka’s Terms and Conditions and our Privacy Policy.
{"\n"}
{"\n"}We do not accept orders for Food Products from minors (individuals under 18 years of age). If you are under 18 years of age, you are not permitted to place any order for Food Products through any Application.
{"\n"}
{"\n"}In these Terms, unless the context otherwise requires, all further references to "you" (and "your", etc) means both you as an individual user and also your organisation (if any).
{"\n"}
{"\n"}We reserve the right to change these Terms from time to time by updating the relevant Application(s) and by changing these Terms on the Website although no such change will affect any Application you have already downloaded.
{"\n"}
{"\n"}
{"\n"}2. Access to the Applications
{"\n"}
{"\n"}Applications may only be downloaded, accessed and used on a device owned or controlled by you and running the relevant operating system for which the Application concerned was designed, so you must make sure you have a compatible device which meets all the necessary technical specifications to enable you to download any Application you wish to download and to access and use each downloaded Application.
{"\n"}
{"\n"}You are responsible for the security of your password that you used to register with any Application.
{"\n"}
{"\n"}We may, from time to time, restrict access to certain features, functions or content of an Application downloaded from any third party application store, to users who have registered with us through an Application. You are not obliged to register with us, but if you do not do so, you will be to use the relevant features, functions or content of an Application downloaded from any third party application store (as the case may be). You must ensure that any registration details you provide are accurate.
{"\n"}
</Text>
<Text>
{"\n"}We cannot and do not guarantee the continuous, uninterrupted or error-free operability of any Application or that any Application will perform at a certain speed (since this depends on a number of factors outside our control).
{"\n"}
{"\n"}We reserve the right to withdraw or suspend the operation of any Application, or cease to provide and/or update content to any Application, with or without notice to you, if we need to do so, including, without limitation, for security, legal or business reasons.
{"\n"}
{"\n"}3. What you are allowed to do
{"\n"}
{"\n"}You may only use any Application for non-commercial, personal use and only in accordance with these terms, for lawful purposes (complying with all applicable laws and regulations), and in a responsible manner.
{"\n"}
{"\n"}Subject to the following sections, you may retrieve and display content from any Application on a computer or mobile device and store that Application in electronic form incidentally in the normal course of use of your browser or mobile device. Additional terms may also apply to certain features, parts or content of any Application and, where they apply, will be displayed before you access the relevant features, parts or content.
{"\n"}
{"\n"}4. What you are not allowed to do
{"\n"}
{"\n"}Except to the extent expressly set out in these Terms, you are not allowed to:
{"\n"}
{"\n"}(a) republish, redistribute or re-transmit any Application;
{"\n"}
{"\n"}(b) copy or store any Application other than for your own non-commercial, personal use and as may occur incidentally in the normal course of use of your browser or mobile device;
{"\n"}
</Text>
<Text>
{"\n"}(c) store any Application on a server or other storage device connected to a network or create a database by systematically downloading and storing any data from any Application;
{"\n"}
{"\n"}(d) remove or change any content of any Application or attempt to circumvent security or interfere with the proper working of any Application or any servers on which it is hosted;
{"\n"}
{"\n"}(e) use any Application in a way that might damage our name or reputation or that of any of our affiliates; or
{"\n"}
{"\n"}(f) otherwise do anything that it is not expressly permitted by these terms.
{"\n"}
{"\n"}All rights granted to you under these Terms will terminate immediately in the event that you are in breach of any of them.
{"\n"}
{"\n"}To do anything with any Application that is not expressly permitted by these terms, you will need a separate licence from us. Please contact us, using the Contacting us details at the end of these Terms.
{"\n"}
{"\n"}5. Third party service providers and application stores
{"\n"}
{"\n"}Certain third party service providers with whose devices and/or operating systems our Applications have been designed to be compatible oblige us to include certain additional provisions in these Terms. These are set out at the end of these Terms under Additional third party terms. These provisions come from the relevant third party service providers, not us and to the extent the other terms and conditions hereof are less restrictive than, or otherwise conflict with, the terms and conditions of the third party store, the more restrictive or conflicting terms and conditions of the third party service provider will apply, but solely with respect to Applications which you obtain through that particular store.
{"\n"}
{"\n"}Third party application stores are operated by the relevant third party service providers and/or its affiliates. We are not responsible for these stores or (with the exception of our Applications) for anything provided by them and do not guarantee that they will be continuously available.
{"\n"}
{"\n"}6. Intellectual property rights
{"\n"}
{"\n"}All intellectual property rights in the Applications and in any content of any Application (including text, graphics, software, photographs and other images, videos, sound, trade marks and logos) are owned by us or our licensors. Except as expressly set out here, nothing in these Terms gives you any rights in respect of any intellectual property owned by us or our licensors and you acknowledge that you do not acquire any ownership rights by downloading any Application or any content from any Application.
{"\n"}
{"\n"}7. Functionality and content
{"\n"}
</Text>
<Text>
{"\n"}You agree that downloading, accessing and use of any Application that is made available for download free of charge are on an 'as is' and 'as available' basis and at your sole risk.
{"\n"}
{"\n"}We reserve the right to change the design, features and/or functionality of any Application by making the updated Application available for download. You are not obliged to download any updated Application, but we may cease to provide and/or update content to prior versions of Applications.
{"\n"}
{"\n"}Where an Application makes content available, you acknowledge that such content may be updated at any time.
{"\n"}
{"\n"}Whilst we try to make sure that content made available by any Application consisting of information of which we are the source is correct, you acknowledge that certain Applications may make content available which is derived from a number of sources, for which we are not responsible. In all cases, information made available by any Application is not intended to amount to authority or advice on which reliance should be placed. You should check with us or the relevant information source before acting on any such information.
{"\n"}
{"\n"}Except as expressly set out in these Terms, we make or give no representation or warranty as to the accuracy, completeness, currency, correctness, reliability, integrity, quality, fitness for purpose or originality of any content of any Application and, to the fullest extent permitted by law, all implied warranties, conditions or other terms of any kind are hereby excluded. To the fullest extent permitted by law, we accept no liability for any loss or damage of any kind incurred as a result of you or anyone else relying on the content of any Application.
{"\n"}
{"\n"}We cannot and do not guarantee that any Application or its content will be free from viruses and/or other code that may have contaminating or destructive elements. It is your responsibility to implement appropriate IT security safeguards (including anti-virus and other security checks) to satisfy your particular requirements as to the safety and reliability of any Application and its content.
{"\n"}
{"\n"}8. Our liability
{"\n"}
{"\n"}Nothing in these terms shall limit or exclude our liability to you:
{"\n"}
{"\n"}(a) for death or personal injury caused by our negligence;
{"\n"}
{"\n"}(b) for fraudulent misrepresentation; or
{"\n"}
</Text>
<Text>
{"\n"}(c) for any other liability that may not, under applicable law, be limited or excluded.
{"\n"}
{"\n"}We will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations that is caused by events outside our reasonable control.
{"\n"}
{"\n"}Some jurisdictions do not allow the exclusion of certain warranties or the exclusion or limitation of liability for consequential or incidental damages, so the limitations set out above may not apply to You.
{"\n"}
{"\n"}9. General
{"\n"}
{"\n"}You may not transfer or assign any or all of your rights or obligations under these Terms.
{"\n"}
{"\n"}All notices given by you to us must be given in writing to the address set out at the end of these Terms.
{"\n"}
{"\n"}If we fail to enforce any of our rights, that does not result in a waiver of that right.
{"\n"}
{"\n"}If any provision of these Terms and conditions is found to be unenforceable, all other provisions shall remain unaffected.
{"\n"}
{"\n"}These Terms may not be varied except with our express written consent.
{"\n"}
{"\n"}These Terms and any document expressly referred to in them represent the entire agreement between you and us in relation to their subject matter.
{"\n"}
{"\n"}These Terms shall be governed by the laws of Tasmania, and you agree that any dispute between you and us regarding them or any Application will only be dealt with by the courts of Tasmania. Nothing shall prevent us from bringing proceedings to protect our intellectual property rights before any competent court.
{"\n"}
{"\n"}
</Text>
<Text>
{"\n"}10. PRIVACY POLICY
{"\n"}
{"\n"}We are committed to protecting the privacy of all visitors to the Website, including all visitors who access the Website or Service through any mobile application or other platform or device. Please read the following Privacy Policy which explains how we use and protect your information.
{"\n"}
{"\n"}
{"\n"}By visiting and/or using the Service on the Website, you agree and, where required, you consent to the collection, use, storage, disclosure and transfer of your information as set out in this policy.
{"\n"}
{"\n"}
{"\n"}10.1 INFORMATION THAT WE COLLECT FROM YOU
{"\n"}
{"\n"}
{"\n"}10.1.1 When you visit the Website or use the Service to make an Order from a Restaurant through the Application (whether or not we are providing Delivery Services), you may be asked to provide information about yourself including your name, address, contact details (such as telephone and mobile numbers and e-mail address) and payment information (such as credit or debit card information). We may also collect information about your usage of the Website and Service and information about you from the materials (such as messages and reviews) you post to the Website and the e-mails or letters you send to us. Your telephone calls to us may also be recorded for training and quality purposes.
{"\n"}
{"\n"}
{"\n"}10.1.2. By accessing Qooka information and/or the Website or Service using mobile digital routes such as (but not limited to) mobile, tablet or other devices/technology including mobile applications, then you should expect that our data collection and usage as set out in this Privacy Policy will apply in that context too. We may collect technical information from your mobile device or your use of the Website or the Service through a mobile device, for example, location data and certain characteristics of, and performance data about, your device, carrier/operating system including device and connection type, IP address, mobile payment methods, interaction with other retail technology such as use of NFC Tags, QR Codes or use of mobile vouchers. Unless you have elected to remain anonymous through your device and/or platform settings, this information may be collected and used by us automatically if you use the Website or Service through your mobile device(s) via any Qooka mobile application, through your mobile's browser or otherwise.
{"\n"}
{"\n"}
{"\n"}10.2 USE OF YOUR INFORMATION
{"\n"}
{"\n"}
{"\n"}10.2.1. Your information will enable us to provide you with access to the relevant parts of the Website and to supply the Service. It will also enable us to bill you and enable us and/or a Restaurant with whom you have placed an Order to contact you where necessary concerning the Service and/or providing Delivery Services. For example, we and/or the Restaurant may use your information to provide you with status updates or other information regarding your Order by e-mail, telephone, mobile or mobile messaging (e.g. SMS, MMS etc.). We will also use and analyse the information we collect so that we can administer, support, improve and develop our business, for any other purpose whether statistical or analytical and to help us prevent fraud. Where appropriate, now and in the future you may have the ability to express your preferences around the use of your data as set out in this Privacy Policy and this may be exercised though your chosen method of using the Service, for example mobile, mobile applications or any representation of the Website.
{"\n"}
</Text>
<Text>
{"\n"}
{"\n"}10.2.2. We may use your information to contact you for your views on the Service and to notify you occasionally about important changes or developments to the Website or the Service.
{"\n"}
{"\n"}
{"\n"}10.2.3. When you register with Qooka, you consent to Qooka using your personal information for direct marketing purposes to communicate with you by phone, email or SMS and, if you use our mobile application, via push notification, to tell you about offers, updates and our products and services that may be of interest to you.
{"\n"}
{"\n"}
{"\n"}10.2.4. You agree that we may also share information with third parties (including those in the food, drink, leisure, marketing and advertising sectors) to use your information in order to let you know about goods and services which may be of interest to you (by post, telephone, mobile messaging (e.g. SMS, MMS etc.) and/or e-mail) in accordance with the Spam Act and the Privacy Act.
{"\n"}
{"\n"}
{"\n"}We may also disclose your information to help us analyse the information which we collect so that we can administer, support, improve and develop our business and services to you.
{"\n"}
{"\n"}
{"\n"}10.2.5. You agree that we may disclose personal information which we collect from you to other companies that also hold information about you. We may also collect personal information from those other companies. We and/or those companies may combine the information in order to better understand your preferences and interests, thereby enabling them and us to serve you better.
{"\n"}
{"\n"}
{"\n"}10.2.6. If you do not want us to use your data in this way or change your mind about being contacted in the future, please let us know by using the contact details set out in paragraph 8 below, by amending your profile accordingly or by using the opt-out facilities provided (eg an unsubscribe link).
{"\n"}
{"\n"}
{"\n"}10.2.7. Please note that by submitting Reviews regarding the Website, Service and/or Restaurants, you consent to us to use such Reviews on the Website and in any marketing or advertising materials. We will only identify you for this purpose by your first name and the city in which you reside (and any other information that you may from time to time consent to us disclosing).
{"\n"}
{"\n"}
{"\n"}10.3 DISCLOSURE OF YOUR INFORMATION
{"\n"}
{"\n"}
</Text>
<Text>
{"\n"}10.3.1. The information you provide to us will be transferred to and stored on our servers which may be in or outside Australia, it may be processed and used by or given to our staff working outside Australia who act for us for the purposes set out in this policy or for other purposes notified to you from time to time in this policy. Where we disclose your personal information to overseas recipients, we will always take reasonable steps to ensure that your information is treated in accordance with this policy and the Australian Privacy Principles.
{"\n"}
{"\n"}
{"\n"}10.3.2. The third parties with whom we share your information may undertake various activities such as processing credit card payments and providing support services for us. In addition, we may need to provide your information to i) any Restaurants that you have placed an Order with so as to allow the Restaurant to process and deliver your Order and ii) any independent courier engaged by us to provide Delivery Services to deliver your Order. By submitting your personal data, you agree to this transfer, storing or processing. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
{"\n"}
{"\n"}
{"\n"}10.3.3. If our business enters into a joint venture with, purchases or is sold to or merged with another business entity, your information may be disclosed or transferred to the target company, our new business partners or owners or their advisors.
{"\n"}
{"\n"}
{"\n"}10.3.4. We may use the information that you provide to us if we are under a duty to disclose or share your information in order to comply with (and/or where we believe we are under a duty to comply with) any legal obligation; or in order to enforce the Website Terms and any other agreement; or to protect our rights or the rights of Restaurants or other third parties. This includes exchanging information with other companies and other organisations for the purposes of fraud protection and prevention.
{"\n"}
{"\n"}
{"\n"}10.4. SECURITY AND DATA RETENTION
{"\n"}
{"\n"}
{"\n"}10.4.1. We take steps to protect your information from unauthorised access, modification or disclosure and against misuse, interference, loss, destruction and damage. Once your information is no longer required for any purpose for which it may be used or disclosed by us, and we are not required by law to retain the information, we will destroy the information or ensure that it is de-identified.
{"\n"}
{"\n"}
{"\n"}10.4.2. Where you have registered an account with Qooka and chosen a password which allows you to access certain parts of the Application, you are responsible for keeping this password confidential. We advise you not to share your password with anyone. Unless we negligently disclose your password to a third party, we will not be liable for any unauthorised transactions entered into using your name and password.
{"\n"}
{"\n"}
{"\n"}10.4.3. All user details captured by Qooka are stored securely at all times and will never be provided to any unauthorised third parties. All credit card details are protected using SSL (Secure Socket Layer) encryption. We will simply save a reference to your card, which is called a Stripe. This Stripe is provided to us by the payment provider. 
{"\n"}
{"\n"}
{"\n"}10.4.4. The transmission of information via the internet is not completely secure. Although we will take reasonable steps to protect your information and make sure it is safe and secure and we use a number of physical, administrative, personnel and technical measures to protect your personal information, we cannot guarantee the security of your data transmitted to the Website/Mobile application; any transmission is at your own risk. For the avoidance of doubt, Qooka will not in any circumstances be liable to you, or third parties, for loss or damage arising from credit card fraud or identity theft.
{"\n"}
{"\n"}
{"\n"}10.5. ACCESSING AND UPDATING
{"\n"}You have the right to see the information we hold about you and to ask us to make any changes to ensure that it is accurate and up to date.
{"\n"}
{"\n"}
{"\n"}11. Contacting us
{"\n"}
{"\n"}All correspondence should be addressed to Qooka by emailing qookamain@gmail.com
{"\n"}
                    </Text>
                </View>
            </ScrollView>
        </View>
      </ImageBackground>

    );
  }
}

const main_color = "#ff9600";
const styles = StyleSheet.create({
  imageBackground: {
      flex:1,
      paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  title: {
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
  },
  container:{
    alignSelf: 'stretch',
    justifyContent: "center",
    alignItems:"center"
  },
  scrollContainer:{
  },
  innerContainer:{
    width:Dimensions.get('window').width/1.1,
    paddingBottom:200
  },
});

//export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
export default Terms;
