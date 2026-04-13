import { Plus } from "lucide-react";
import SubjectCard from "../components/SubjectCard";
import Modal from "../components/Modal";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "../components/contexts/ToastContext";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import useAuthenticatedMutation from "../hooks/useAuthenticatedMutation";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

interface subject {
  id: number;
  name: string;
  color: string;
  created_at: string;
}
interface addSubject {
  name: string;
  color: string;
}
interface Subject {
  id: number;
  name: string;
  color: string;
}

const Dashboard = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const handelCloseModal = () => {
    setIsModalOpen(false);
  };

  const [subject, setSubject] = useState<addSubject>({
    name: "",
    color: "#ff0000",
  });
  const modalOpen = () => {
    setSubject({
      name: "",
      color: "#ff0000",
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };
  const handelEdit = (subject: Subject) => {
    setSubject({
      name: subject.name,
      color: subject.color,
    });
    setIdEdit(subject.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const { data, isLoading } = useAuthenticatedQuery({
    key: ["subject"],
    url: "/subjects",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });
  const { mutate: createSubject, isPending } = useAuthenticatedMutation({
    url: "/subjects",
    method: "post",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });

  const { mutate: updateSubject } = useAuthenticatedMutation({
    url: `/subjects/${idEdit}`,
    method: "put",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });

  const { mutate: deleteSubject } = useAuthenticatedMutation({
    url: "/subjects",
    method: "delete",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });
  const handelDelete = (id: number) => {
    deleteSubject(id, {
      onSuccess: () => {
        showToast("Deleted successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["subject"] });
      },
    });
  };
  const handleCreate = () => {
    if (isEdit) {
      updateSubject(subject, {
        onSuccess: () => {
          showToast("Subject Edit successfully", "success");
          handelCloseModal();

          setSubject({
            name: "",
            color: "#ff0000",
          });

          queryClient.invalidateQueries({ queryKey: ["subject"] });
        },
        onError: () => {
          showToast("Something went wrong", "error");
        },
      });
    } else {
      createSubject(subject, {
        onSuccess: () => {
          showToast("Subject added successfully", "success");
          handelCloseModal();

          setSubject({
            name: "",
            color: "#ff0000",
          });

          queryClient.invalidateQueries({ queryKey: ["subject"] });
        },
        onError: () => {
          showToast("Something went wrong", "error");
        },
      });
    }
  };
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className=" mb-8 flex items-center justify-between">
          <div>
            <h1
              className="font-serif mb-2"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#1a1a1a",
              }}
            >
              Your Subjects
            </h1>
            <p className="text-lg" style={{ color: "#555555" }}>
              Manage and organize your study materials
            </p>
          </div>
          <div>
            <button
              className="mt-6 md:mt-0 h-10 px-6 rounded-full flex items-center gap-2 text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "#3a3a3a",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
              onClick={() => modalOpen()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5b8dd9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3a3a3a";
              }}
            >
              <Plus className="w-5 h-5" />
              Add Subject
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((subject: subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              name={subject.name}
              uploaded={new Date(subject.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
              color={subject.color}
              onEdit={() => handelEdit(subject)}
              onDelete={() => handelDelete(subject.id)}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModel={handelCloseModal}
        title={isEdit ? "Edit Subject" : "Add Subject"}
      >
        <div>
          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Subject Name"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-xl transition"
              value={subject.name}
              onChange={(e) =>
                setSubject((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <div className="relative w-full">
              <input
                type="text"
                value={subject.color}
                onChange={(e) =>
                  setSubject((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
                placeholder="#ff0000"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 pr-14 rounded-xl"
              />

              {/* Color Picker Button */}
              <input
                type="color"
                value={subject.color}
                onChange={(e) =>
                  setSubject((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none bg-transparent cursor-pointer brdered rounded-full"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="gap-3 mt-6 flex justify-end">
            <button
              className=" px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              style={{
                background: "#3a3a3a",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
              onClick={handelCloseModal}
            >
              cancel
            </button>
            <button
              className=" px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition "
              style={{
                background: "#3a3a3a",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
              onClick={handleCreate}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : isEdit ? (
                "Edit"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
