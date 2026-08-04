// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import CustomButton from "../components/common/buttonComponent";
// import SaveArea from "../components/common/safeArea";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const SLIDES = [
//   {
//     id: "1",
//     title: "Rent or Lend with",
//     titleHighlight: "Confidence",
//     description:
//       "TrustLend connects you with verified people to rent or lend equipment safely with secure payments and peace of mind.",
//     image: require("../assets/images/onboarding1.png"),
//   },
//   {
//     id: "2",
//     title: "Rent safe",
//     titleHighlight: "Earn more",
//     description:
//       "List your equipment, reach more people and grow your income with our trust-first security and payments.",
//     image: require("../assets/images/onboarding2.png"),
//   },
//   {
//     id: "3",
//     title: "Built on Trust",
//     titleHighlight: "",
//     description:
//       "Identity Verification, Secure Payments, and Protected Deposits guaranteed.",
//     image: require("../assets/images/onboarding3.png"),
//   },
// ];

// export default function OnboardingScreen() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef(null);
//   const router = useRouter();

//   // Save flag to storage and route to login
//   const completeOnboarding = async () => {
//     try {
//       await AsyncStorage.setItem("hasSeenOnboarding", "true");
//       router.replace("/RenterSignUp");
//     } catch (error) {
//       router.replace("/login");
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < SLIDES.length - 1) {
//       flatListRef.current?.scrollToIndex({
//         index: currentIndex + 1,
//         animated: true,
//       });
//     } else {
//       completeOnboarding();
//     }
//   };

//   const handleScroll = (event) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     const index = Math.round(offsetX / SCREEN_WIDTH);
//     setCurrentIndex(index);
//   };

//   const renderSlide = ({ item }) => (
//     <View style={styles.slide}>
//       <View style={styles.imageContainer}>
//         <Image source={item.image} style={styles.image} resizeMode="contain" />
//       </View>

//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={[styles.title, { color: "#E8A325", marginBottom: 12 }]}>
//           {item.titleHighlight}
//         </Text>
//         <Text style={styles.description}>{item.description}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SaveArea backgroundColor="#F2F6FF">
//       <View style={styles.container}>
//         <FlatList
//           ref={flatListRef}
//           data={SLIDES}
//           renderItem={renderSlide}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           keyExtractor={(item) => item.id}
//         />

//         <View style={styles.bottomSection}>
//           <View style={styles.paginationContainer}>
//             {SLIDES.map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.dot,
//                   currentIndex === index
//                     ? styles.activeDot
//                     : styles.inactiveDot,
//                 ]}
//               />
//             ))}
//           </View>

//           <CustomButton
//             onPress={handleNext}
//             activeOpacity={0.8}
//             name={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
//           />

//           {currentIndex < SLIDES.length - 1 ? (
//             <TouchableOpacity
//               onPress={completeOnboarding}
//               style={styles.skipButton}
//             >
//               <Text style={styles.skipText}>Skip</Text>
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.skipPlaceholder} />
//           )}
//         </View>
//       </View>
//     </SaveArea>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   slide: {
//     width: SCREEN_WIDTH - 48,
//     alignItems: "center",
//     justify: "center",
//   },
//   imageContainer: {
//     flex: 0.6,
//     justify: "center",
//     alignItems: "center",
//     width: "100%",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   textContainer: {
//     flex: 0.4,
//     alignItems: "center",
//     paddingHorizontal: 12,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#0B2554",
//     textAlign: "center",
//   },
//   description: {
//     fontSize: 14,
//     color: "#4A5568",
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   bottomSection: {
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   paginationContainer: {
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   dot: {
//     height: 6,
//     borderRadius: 3,
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: "#0A192F",
//   },
//   inactiveDot: {
//     width: 6,
//     backgroundColor: "#CBD5E1",
//   },
//   button: {
//     width: "100%",
//     height: 52,
//     backgroundColor: "#0A192F",
//     borderRadius: 8,
//     justify: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   skipButton: {
//     marginTop: 16,
//     paddingVertical: 8,
//   },
//   skipText: {
//     color: "#0B2554",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   skipPlaceholder: {
//     height: 38, // Maintains layout height when Skip hides on slide 3
//   },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/common/buttonComponent";
import SaveArea from "../components/common/safeArea";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Rent or Lend with",
    titleHighlight: "Confidence",
    description:
      "TrustLend connects you with verified people to rent or lend equipment safely with secure payments and peace of mind.",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    id: "2",
    title: "Rent safe",
    titleHighlight: "Earn more",
    description:
      "List your equipment, reach more people and grow your income with our trust-first security and payments.",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    id: "3",
    title: "Built on Trust",
    titleHighlight: "",
    description:
      "Identity Verification, Secure Payments, and Protected Deposits guaranteed.",
    image: require("../assets/images/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const router = useRouter();

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/RenterSignUp");
    } catch (error) {
      router.replace("/login");
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <SaveArea backgroundColor="#F2F6FF">
      <View style={styles.container}>
        {/* Horizontal ScrollView taking full screen width */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {SLIDES.map((item) => (
            <View key={item.id} style={styles.slide}>
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {item.titleHighlight ? (
                  <Text style={styles.highlight}>{item.titleHighlight}</Text>
                ) : null}
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={[styles.bottomSection, { width: SCREEN_WIDTH }]}>
          <View style={styles.paginationContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton
              onPress={handleNext}
              activeOpacity={0.8}
              name={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
            />
          </View>

          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity
              onPress={completeOnboarding}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>
      </View>
    </SaveArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  slide: {
    width: SCREEN_WIDTH, // Exactly matches device screen width
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    flex: 0.55,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 0.45,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 32, // Padding is INSIDE the text box, not on the slide!
  },
  title: {
    fontFamily: "pBold",
    fontSize: 24,
    color: "#0B2554",
    textAlign: "center",
  },
  highlight: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E8A325",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontFamily: "pRegular",
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSection: {
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#0A192F",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#CBD5E1",
  },
  buttonWrapper: {
    width: "100%",
    paddingHorizontal: 24, // Button padding handled here
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: "pMedium",
    color: "#0B2554",
    fontSize: 14,
  },
  skipPlaceholder: {
    height: 38,
  },
});