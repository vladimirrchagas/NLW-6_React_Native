import React, { ReactNode } from "react";
import { View, ModalProps, Modal, TouchableWithoutFeedback } from "react-native";
import { Background } from "../Background";

import { styles } from "./styles";

type Props = ModalProps & {
  children: ReactNode;
  closeModal: () => void;
}

export function ModalView({children, closeModal, ...rest}: Props) {
  return (
    <Modal
      style={styles.container}
      animationType="slide"
      transparent
      statusBarTranslucent
      {...rest}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Background>
                <View style={styles.bar} />
                {children}
            </Background>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}