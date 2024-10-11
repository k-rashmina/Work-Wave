import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getUser } from "../../../lib/apiRequests/userApiClient";

const Header = () => {
  const [firstName, setFirstName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setFirstName(user.firstName);
        setProfilePhoto(user.profileImageURL);
      }
    };
    fetchUser();
  }, [firstName, profilePhoto]);

  return {
    title: firstName ? `Hello, ${firstName}!` : "Welcome!",
    headerRight: () => (
      <TouchableOpacity onPress={() => router.push({ pathname: "/profile" })}>
        <Image
          source={{
            uri: profilePhoto
              ? profilePhoto
              : "https://avatar.iran.liara.run/public/44",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 2,
            borderColor: "#3498DB",
          }}
        />
      </TouchableOpacity>
    ),
  };
};

export default Header;
