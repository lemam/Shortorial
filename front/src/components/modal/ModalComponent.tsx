import { Modal, Button } from "react-bootstrap";
import React from "react";

interface ModalType {
  title: string;
  body: React.ReactNode;
  showModal: boolean;
  handleCloseModal: () => void;
  goToLearnMode: () => void;
  goToChallengeMode: () => void;
}

const ModalComponent = ({
  title,
  body,
  showModal,
  handleCloseModal,
  goToLearnMode,
  goToChallengeMode,
}: ModalType) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} size="sm"  scrollable >
      <Modal.Header closeButton >
        <Modal.Title style={{fontSize: "14px" , fontWeight: "bold"}}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer style={{justifyContent: "center" , padding: "5px"}}>
        <Button variant="secondary" onClick={goToLearnMode}>
          연습 모드
        </Button>
        <Button variant="primary" onClick={goToChallengeMode}>
          챌린지 모드
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
