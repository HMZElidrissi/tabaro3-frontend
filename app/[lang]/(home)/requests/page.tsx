"use client";

import { BloodRequest } from "@/app/lib/definitions";
import { InboxIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Contact2Icon, PhoneIcon, UserCircle } from "lucide-react";
import { useTranslation } from "@/app/lib/useTranslation";
import useSWR from "swr";
import axiosClient from "@/app/lib/axiosClient";

const fetcher = (url: string) => axiosClient.get(url).then((res) => res.data);

const BloodRequestItem = ({
  request,
  t,
}: {
  request: BloodRequest;
  t: (key: string) => string;
}) => (
  <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
    <div className="w-full flex items-center justify-between p-6 space-x-6">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <h3 className="text-gray-900 text-sm font-bold">
            {t("Blood Group")}:
          </h3>
          <span className="flex-shrink-0 inline-block px-2 py-0.5 badge-blood-group">
            {request.blood_group}
          </span>
        </div>
        <div className="mt-2 text-gray-800 text-sm font-medium flex items-center">
          <MapPinIcon className="h-4 w-4 inline-block mr-2" />
          {request.city}
        </div>
        <p className="mt-1 text-gray-500 text-sm whitespace-pre-wrap">
          {request.description}
        </p>
        <div className="mt-2 text-gray-600 text-sm font-medium flex items-center">
          <UserCircle className="h-4 w-4 inline-block mr-2" />
          {request.user!.name}
        </div>
        <div className="mt-1 text-gray-600 text-sm font-medium flex items-center">
          <InboxIcon className="h-4 w-4 inline-block mr-2" />
          {request.user!.email}
        </div>
        <div className="mt-1 text-gray-600 text-sm font-medium flex items-center">
          <PhoneIcon className="h-4 w-4 inline-block mr-2" />
          {request.user!.phone}
        </div>
      </div>
    </div>
    <div>
      <div className="-mt-px flex divide-x divide-gray-200">
        <a
          href={`mailto:${request.user!.email}`}
          className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
        >
          <Contact2Icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="ml-3">{t("Contact")}</span>
        </a>
      </div>
    </div>
  </li>
);

const BloodRequestsClient = () => {
  const { t } = useTranslation();
  const {
    data: requests,
    error,
    isLoading,
  } = useSWR<BloodRequest[]>("/blood-requests/all", fetcher);

  return (
    <div className="py-20">
      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("Blood Requests")}
          </p>
        </div>
        {isLoading ? (
          <div className="w-full text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">{t("requests.loading")}</p>
          </div>
        ) : error ? (
          <div className="w-full text-center py-10 text-red-500">
            {t("Error loading blood requests")}
          </div>
        ) : requests && requests.length === 0 ? (
          <div className="w-full text-gray-500 py-6 text-center">
            {t("No blood requests found")}
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6"
          >
            {requests &&
              requests.map((request) => (
                <BloodRequestItem key={request.id} request={request} t={t} />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BloodRequestsClient;
