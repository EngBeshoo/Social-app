import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { deleteComment } from "../../services/commentApi";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

export default function DropDownComment({ commentId, onCommentDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    async function handleDeleteComment() {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return
        }

        setIsDeleting(true)
        try {
            const success = await deleteComment(commentId)
            console.log('Delete response:', success)
            
            if (success) {
                
                if (onCommentDeleted) {
                    onCommentDeleted()
                }
            } else {
                alert('Failed to delete comment')
            }
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('An error occurred while deleting the comment')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
        <Dropdown>
            <DropdownTrigger>
                <Button 
                    isIconOnly 
                    variant="light" 
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Comment Actions">
                <DropdownItem key="edit">
                 <Button color='primary'  onPress={onOpen}>Edit comment</Button>

                </DropdownItem>
                <DropdownItem 
                    key="delete" 
                    className="text-danger" 
                    color="danger"
                    onClick={handleDeleteComment}
                    isDisabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : '🗑️ Delete Comment'}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        {/* Model */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                  deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </>
    );
}