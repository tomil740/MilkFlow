import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

type UserType = "customer" | "distributor";

interface FloatingActionButtonProps {
  userType: UserType;
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  userType,
  onClick,
}) => {
  const actions = {
    customer: "Add to Cart",
    distributor: "Add Demand",
  };

  return (
    <motion.div
      className={clsx(
        "fixed bottom-4 right-4 md:bottom-6 md:right-6",
        "flex items-center justify-center",
        "rounded-full shadow-lg cursor-pointer",
        "transition-all duration-200",
        userType === "customer"
          ? "bg-[--color-primary] hover:bg-[--color-primary-container] text-[--color-on-primary]"
          : "bg-[--color-tertiary] hover:bg-[--color-tertiary-container] text-[--color-on-tertiary]"
      )}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label="Floating Action Button"
      style={{
        width: 56,
        height: 56,
      }}
    >
      <span className="font-bold text-sm">{actions[userType]}</span>
    </motion.div>
  );
};

export default FloatingActionButton;
