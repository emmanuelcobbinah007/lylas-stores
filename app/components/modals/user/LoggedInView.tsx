"use client";

import React from "react";
import { Settings, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";

type LoggedInViewProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout: () => void;
  onClose: () => void;
};

export default function LoggedInView({
  user,
  onLogout,
  onClose,
}: LoggedInViewProps) {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-poppins font-medium">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h3 className="font-poppins font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-600 font-poppins">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <Link href="/orders">
          <button
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            onClick={onClose}
          >
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span className="font-poppins text-gray-900">My Orders</span>
          </button>
        </Link>

        <button
          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          onClick={onClose}
        >
          <Heart className="w-5 h-5 text-gray-600" />
          <span className="font-poppins text-gray-900">Wishlist</span>
        </button>

        <button
          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          onClick={onClose}
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-poppins text-gray-900">Account Settings</span>
        </button>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-poppins">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
