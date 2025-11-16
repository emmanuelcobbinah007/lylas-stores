"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import ReviewModal from "../components/modals/ReviewModal";

interface OrderItem {
  id: string;
  quantity: number;
  size: string | null;
  priceAtTimeOfOrder: number | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
  total: number;
  itemCount: number;
}

interface ReviewStatus {
  hasReviewedAll: boolean;
  totalProducts: number;
  reviewedProducts: number;
  unreviewedProducts: { id: string; name: string; images: { url: string }[] }[];
}

const formatOrderStatus = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "PROCESSING":
      return "Processing";
    case "PENDING":
      return "Pending";
    case "PAID":
      return "Paid";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Processing";
  }
};

const getStatusColorClasses = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const OrdersPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [reviewStatuses, setReviewStatuses] = useState<
    Record<string, ReviewStatus>
  >({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] =
    useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Orders per page

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const { user: userData } = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", user?.id, currentPage, pageSize],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");
      const response = await axios.get(
        `/api/orders?page=${currentPage}&limit=${pageSize}`
      );
      if (response.data.success) {
        return response.data;
      }
      throw new Error("Failed to fetch orders");
    },
    enabled: !!user?.id,
  });

  const orders = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders");
    }
  }, [error]);

  // Check review status for completed orders
  useEffect(() => {
    if (orders) {
      orders.forEach((order: Order) => {
        if (order.status === "COMPLETED" && !reviewStatuses[order.id]) {
          checkReviewStatus(order.id);
        }
      });
    }
  }, [orders]);

  const handleReorderItems = (order: Order) => {
    if (order.orderItems.length > 1) {
      toast.info("Redirecting to shop page to reorder multiple items");
      // Assuming /discover is the shop page
      window.location.href = "/discover";
    } else {
      const productId = order.orderItems[0].product.id;
      // Assuming product page exists
      window.location.href = `/discover/${productId}`;
    }
  };

  const checkReviewStatus = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/reviews/check?orderId=${orderId}`);
      if (response.data.success) {
        setReviewStatuses((prev) => ({
          ...prev,
          [orderId]: response.data,
        }));
      }
    } catch (error) {
      console.error("Error checking review status:", error);
    }
  };

  const handleLeaveReview = (order: Order) => {
    setSelectedOrderForReview(order);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh review status for the order
    if (selectedOrderForReview) {
      checkReviewStatus(selectedOrderForReview.id);
    }
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="w-[90%] md:w-[85%] mx-auto py-8">
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-playfair">
              Please log in to view your orders
            </h2>
            <p className="text-gray-600 mb-6 font-poppins">
              Use the sign in button in the navigation bar to access your order
              history
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium font-poppins"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto my-8">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-center md:text-3xl text-2xl font-semibold text-gray-900 font-playfair">
              My Orders
            </h1>
            <p className="text-center text-gray-600 font-poppins">
              View your order history and track your purchases
            </p>
          </div>

          {/* Orders List */}
          {!orders || orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2 font-playfair">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6 font-poppins">
                You haven&apos;t placed any orders. Start shopping now!
              </p>
              <Link
                href="/discover"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-poppins"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 font-playfair">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 font-poppins">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClasses(
                            order.status
                          )} font-poppins`}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.orderItems.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={
                                item.product.images?.[0]?.url ||
                                "/placeholder-image.jpg"
                              }
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate font-poppins">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-500 font-poppins">
                                Qty: {item.quantity}
                              </p>
                              {item.size && (
                                <p className="text-sm text-gray-500 font-poppins">
                                  Size: {item.size}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-gray-900 font-poppins">
                                ₵
                                {(
                                  (item.priceAtTimeOfOrder ||
                                    item.product.price) * item.quantity
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 font-poppins">
                          Total (
                          {order.orderItems.reduce(
                            (sum: number, item: OrderItem) =>
                              sum + item.quantity,
                            0
                          )}{" "}
                          items)
                        </span>
                        <span className="text-lg font-bold text-gray-900 font-playfair">
                          ₵
                          {order.orderItems
                            .reduce(
                              (sum: number, item: OrderItem) =>
                                sum +
                                (item.priceAtTimeOfOrder ||
                                  item.product.price) *
                                  item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons for Completed Orders */}
                    {order.status === "COMPLETED" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleReorderItems(order)}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium font-poppins"
                          >
                            Reorder Items
                          </button>
                          {reviewStatuses[order.id] ? (
                            reviewStatuses[order.id].hasReviewedAll ? (
                              <div className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium font-poppins flex items-center justify-center">
                                <span className="mr-2">✓</span>
                                Reviews Submitted
                              </div>
                            ) : (
                              <button
                                onClick={() => handleLeaveReview(order)}
                                className="flex-1 px-4 py-2 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium font-poppins"
                              >
                                Leave a Review (
                                {
                                  reviewStatuses[order.id].unreviewedProducts
                                    .length
                                }{" "}
                                remaining)
                              </button>
                            )
                          ) : (
                            <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium font-poppins flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                              Checking reviews...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Processing Status Message */}
                    {order.status !== "COMPLETED" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center text-gray-900">
                          <span className="text-sm font-medium font-poppins">
                            Your order is{" "}
                            {formatOrderStatus(order.status).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700 font-poppins">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} orders
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum =
                        Math.max(
                          1,
                          Math.min(pagination.totalPages - 4, currentPage - 2)
                        ) + i;
                      if (pageNum > pagination.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            pageNum === currentPage
                              ? "text-white bg-gray-900"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrderForReview && reviewStatuses[selectedOrderForReview.id] && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          orderId={selectedOrderForReview.id}
          unreviewedProducts={
            reviewStatuses[selectedOrderForReview.id].unreviewedProducts
          }
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default OrdersPage;
