import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BoltIcon,
    title: "Volt",
    value: "3,5 V",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Voltage",
    },
  },
  {
    color: "gray",
    icon: ArrowTrendingUpIcon,
    title: "Ampere",
    value: "5,01 A",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Current",
    },
  },
  {
    color: "gray",
    icon: LightBulbIcon,
    title: "Watt",
    value: "15 Watt",
    footer: {
      color: "text-red-500",
      value: "",
      label: "Power",
    },
  },
  {
    color: "gray",
    icon: ExclamationTriangleIcon,
    title: "Kilowatt/H",
    value: "18 kWh",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Energy",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Hertz",
    value: "103,4 Hz",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Frequency",
    },
  },
];

export default statisticsCardsData;
