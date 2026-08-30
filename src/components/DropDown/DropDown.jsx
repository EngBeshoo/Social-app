import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Input } from "@heroui/react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { updatePost, deletePost } from "../../services/postApi";
import { useNavigate } from "react-router-dom";

export default function DropDown({ post, onPostDeleted }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { userData, getUserName, getUserAvatar } = useAuth();
    const navigate = useNavigate();
    
   
    const [editTitle, setEditTitle] = useState(post?.title || '');
    const [editBody, setEditBody] = useState(post?.body || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleEditPost(e) {
        e.preventDefault();
        
        if (!editTitle.trim() || !editBody.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await updatePost(post.id, {
                title: editTitle,
                body: editBody
            });

            console.log('Post updated:', response);

            if (response) {
                if (onPostDeleted) {
                    onPostDeleted();
                }
                onOpenChange(false);
                navigate('/home');
            } else {
                setError('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    // ✅ دالة حذف البوست
    async function handleDeletePost() {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const success = await deletePost(post.id);
            if (success) {
                if (onPostDeleted) {
                    onPostDeleted();
                }
                navigate('/');
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An error occurred');
        }
    }

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                        isIconOnly 
                        variant="light" 
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Post Actions">
                    <DropdownItem key="edit">
                        <span onClick={onOpen} className="flex items-center gap-2">
                            ✏️ Edit Post
                        </span>
                    </DropdownItem>
                    <DropdownItem 
                        key="delete" 
                        className="text-danger" 
                        color="danger"
                        onClick={handleDeletePost}
                    >
                        🗑️ Delete Post
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

            {/* ✅ Modal للتعديل */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                ✏️ Edit Post
                            </ModalHeader>
                            <form onSubmit={handleEditPost}>
                                <ModalBody>
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
                                            ❌ {error}
                                        </div>
                                    )}
                                    
                                  
                                    <Input
                                        label="Title"
                                        placeholder="Enter post title..."
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        variant="bordered"
                                        radius="lg"
                                        isRequired
                                    />

                                    {/* ✅ محتوى البوست */}
                                    <Input
                                        label="Content"
                                        placeholder="Enter post content..."
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                        variant="bordered"
                                        radius="lg"
                                        isRequired
                                    />

                                    {/* ✅ صورة المستخدم (عرض فقط) */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <img 
                                            className="rounded-full w-8 h-8 object-cover border-2 border-gray-200" 
                                            src={getUserAvatar()}
                                            alt={getUserName()}
                                        />
                                        <span className="text-sm text-gray-600">
                                            Editing as: {getUserName()}
                                        </span>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        color="danger" 
                                        variant="light" 
                                        onPress={onClose}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        color="primary" 
                                        type="submit"
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : '💾 Save Changes'}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}