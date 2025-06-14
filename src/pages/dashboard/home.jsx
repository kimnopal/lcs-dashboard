import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Switch,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { ArrowTrendingUpIcon, BoltIcon, ChartBarIcon, ExclamationTriangleIcon, LightBulbIcon, ArrowsUpDownIcon, ClockIcon } from "@heroicons/react/24/solid";
import mqtt from "mqtt";
import { statisticsChartsData } from "@/data";
import { StatisticsChart } from "@/widgets/charts";
import { chartsConfig } from "@/configs";
import { database } from "@/utils/firebase";
import { get, limitToLast, onValue, orderByKey, query, ref } from "firebase/database";

export function Home() {
  const [isManual, setIsManual] = useState(false);
  const [monitoringData, setMonitoringData] = useState([{
    color: "gray",
    icon: BoltIcon,
    title: "Volt",
    value: "∞",
    unit: "V",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Voltage",
    },
    topic: "LCS/sensorLCS/PM/voltage",
  },
  {
    color: "gray",
    icon: ArrowTrendingUpIcon,
    title: "Ampere",
    value: "∞",
    unit: "A",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Current",
    },
    topic: "LCS/sensorLCS/PM/current",
  },
  {
    color: "gray",
    icon: LightBulbIcon,
    title: "Watt",
    value: "∞",
    unit: "Watt",
    footer: {
      color: "text-red-500",
      value: "",
      label: "Power",
    },
    topic: "LCS/sensorLCS/PM/power",
  },
  {
    color: "gray",
    icon: ExclamationTriangleIcon,
    title: "Kilowatt/H",
    value: "∞",
    unit: "kWh",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Energy",
    },
    topic: "LCS/sensorLCS/PM/energy",
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Hertz",
    value: "∞",
    unit: "Hz",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Frequency",
    },
    topic: "LCS/sensorLCS/PM/frequency",
  },
  {
    color: "gray",
    icon: ArrowsUpDownIcon,
    title: "Power Factor",
    value: "∞",
    unit: "",
    footer: {
      color: "text-green-500",
      value: "",
      label: "Power Factor",
    },
    topic: "LCS/sensorLCS/PM/powerfactor",
  }])

  const [chartData, setChartData] = useState([
    {
      code: "voltage",
      color: "white",
      title: "Voltage Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Voltage",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#FFD700"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
    {
      code: "current",
      color: "white",
      title: "Current Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Current",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#1E90FF"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
    {
      code: "power",
      color: "white",
      title: "Power Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Power",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#FF4500"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
    {
      code: "energy",
      color: "white",
      title: "Energy Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Energy",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#32CD32"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
    {
      code: "frequency",
      color: "white",
      title: "Frequency Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Frequency",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#FFA500"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
    {
      code: "powerfactor",
      color: "white",
      title: "Power Factor Monitoring",
      description: "-",
      footer: "updated 4 min ago",
      chart: {
        type: "line",
        height: 320,
        series: [
          {
            name: "Power Factor",
            data: [],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#8A2BE2"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: false,
          },
        },
      },
    },
  ])

  const [switchData, setSwitchData] = useState([
    {
      id: "0",
      checked: false,
      label: "Switch 0",
    },
    {
      id: 1,
      checked: false,
      label: "Switch 1",
    },
    {
      id: 2,
      checked: false,
      label: "Switch 2",
    },
    {
      id: 3,
      checked: false,
      label: "Switch 3",
    },
    {
      id: 4,
      checked: false,
      label: "Switch 4",
    },
    {
      id: 5,
      checked: false,
      label: "Switch 5",
    },

    {
      id: 6,
      checked: false,
      label: "Switch 6",
    },
    {
      id: 7,
      checked: false,
      label: "Switch 7",
    },
    {
      id: 8,
      checked: false,
      label: "Switch 8",
    },
    {
      id: 9,
      checked: false,
      label: "Switch 9",
    },
    {
      id: 10,
      checked: false,
      label: "Switch 10",
    },
    {
      id: 11,
      checked: false,
      label: "Switch 11",
    },
    {
      id: 12,
      checked: false,
      label: "Switch 12",
    },
    {
      id: 13,
      checked: false,
      label: "Switch 13",
    },
    {
      id: 14,
      checked: false,
      label: "Switch 14",
    },
    {
      id: 15,
      checked: false,
      label: "Switch 15",
    },
    {
      id: 16,
      checked: false,
      label: "Switch 16",
    },
    {
      id: 17,
      checked: false,
      label: "Switch 17",
    },
    {
      id: 18,
      checked: false,
      label: "Switch 18",
    },
    {
      id: 19,
      checked: false,
      label: "Switch 19",
    },
  ]
  );

  const [client, setClient] = useState(null);

  const handleManualChange = (e) => {
    const { checked } = e.target;
    setIsManual(!isManual);
    client.publish(`LCS/relayLCS/mode/command`, checked ? "MANUAL" : "AUTO", { retain: true }, (err) => {
      if (err) {
        console.log("error", err);
      }
    }
    );
  }

  const handleSwitchChange = (e) => {
    const { id, checked: checkedSwitch } = e.target;

    setSwitchData((prev) =>
      prev.map((item) =>
        item.id === parseInt(id)
          ? { ...item, checked: checkedSwitch }
          : item
      )
    );

    client.publish(`LCS/relayLCS/control`, checkedSwitch ? `RELAY_${id}:ON` : `RELAY_${id}:OFF`, { retain: true }, (err) => {
      if (err) {
        console.log("error", err);
      }
    });

    client.publish(`LCS/relayLCS/status/${id}`, checkedSwitch ? `ON` : `OFF`, { retain: true }, (err) => {
      if (err) {
        console.log("error", err);
      }
    });
  }

  useEffect(() => {
    let client = mqtt.connect("wss://5fee0bbd48cc456fb4365291207b4a6e.s1.eu.hivemq.cloud:8884/mqtt", {
      username: "adminLCS",
      password: "adminLCS123",
    });

    setClient(client);

    client.on("connect", () => {
      client.subscribe(`LCS/relayLCS/mode/command`, (err) => {
        if (err) {
          console.log("error", err);
        }
      });

      client.subscribe(`LCS/relayLCS/control`, (err) => {
        if (err) {
          console.log("error", err);
        }
      });

      switchData.forEach(({ id }) => {
        client.subscribe(`LCS/relayLCS/status/${id}`, (err) => {
          if (err) {
            console.log("error", err);
          }
        });
      })

      monitoringData.forEach(({ topic }) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.log("error", err);
          }
        })
      });
    });

    client.on("error", (err) => console.log(err));

    client.on("message", (topic, message) => {
      if (topic === "LCS/relayLCS/mode/command") {
        setIsManual(message.toString() === "MANUAL");
      }

      if (topic.includes("LCS/sensorLCS/PM")) {
        setMonitoringData((prev) => {
          return prev.map((item) => {
            if (item.topic === topic) {
              return { ...item, value: message.toString() }
            }
            return item;
          })
        })
      }

      if (topic.includes("LCS/relayLCS/status")) {
        setSwitchData((prev) => {
          return prev.map((item) => {
            if (topic.includes(`LCS/relayLCS/status/${item.id}`)) {
              return { ...item, checked: message.toString() === "ON" }
            }
            return item;
          })
        })
      }

      // message is Buffer
      // client.end();
    });

    const fetchData = async () => {
      const dataRef = query(ref(database, '/sensor_data'), limitToLast(20));
      try {
        onValue(dataRef, (snapshot) => {
          const data = snapshot.val();
          console.log("Fetched data:", data);
          
          // Define metrics to track
          const metrics = ['voltage', 'current', 'energy', 'frequency', 'power', 'powerfactor'];
          
          // Process data for each metric
          metrics.forEach(metric => {
            const metricData = [];
            const timestamps = [];

            Object.entries(data).forEach(([key, entry]) => {
              if (entry && entry[metric] !== undefined) {
                metricData.push(parseFloat(entry[metric]));
                timestamps.push(key);
              }
            });

            // Calculate average
            const avgValue = metricData.length > 0
              ? (metricData.reduce((a, b) => a + b, 0) / metricData.length).toFixed(1)
              : 0;

            // Update chartData for this metric
            setChartData(prev => {
              return prev.map(item => {
                if (item.code === metric) {
                  return {
                    ...item,
                    description: `Average ${metric}: ${avgValue}${getUnitForMetric(metric)}`,
                    footer: `updated ${new Date().toLocaleTimeString()}`,
                    chart: {
                      ...item.chart,
                      series: [{
                        ...item.chart.series[0],
                        data: metricData
                      }],
                      options: {
                        ...item.chart.options,
                        xaxis: {
                          ...item.chart.options.xaxis,
                          categories: timestamps
                        }
                      }
                    }
                  };
                }
                return item;
              });
            });
          });
        });

        // Helper functions
        function getUnitForMetric(metric) {
          const units = {
            voltage: 'V',
            current: 'A',
            energy: 'kWh',
            frequency: 'Hz',
            power: 'W',
            powerfactor: ''
          };
          return units[metric] || '';
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [])

  return (
    <div className="mt-12">

      {/* Graph Data */}
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Graph Data
      </Typography>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        {chartData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>

      {/* Monitoring Data */}
      <Typography variant="h3" className="mb-3">Monitoring Data</Typography>
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-5">
        {monitoringData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            value={rest.value + " " + rest.unit}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      {/* Control Mode */}
      <Typography variant="h3" color="blue-gray" className="mb-2">
        Control Mode
      </Typography>
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Mode
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <Switch
              id={"mode"}
              label={isManual ? "Manual" : "Auto"}
              defaultChecked={isManual}
              checked={isManual}
              onChange={handleManualChange}
              labelProps={{
                className: "text-sm font-normal text-blue-gray-500",
              }}
            />
          </CardBody>
        </Card>
      </div>

      {/* Control Switch */}
      <Typography variant="h3" className="mb-3">Control Switch</Typography>
      <div className="mb-12 grid gap-y-10 gap-x-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {switchData.map(({ id, checked, label }) => (
          <Card className="border border-blue-gray-100 shadow-sm" key={id}>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6"
            >
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {label}
              </Typography>
            </CardHeader>
            <CardBody className="pt-0">
              <Switch
                id={id}
                label={checked ? "ON" : "OFF"}
                defaultChecked={checked}
                checked={checked}
                onChange={handleSwitchChange}
                disabled={!isManual}
                labelProps={{
                  className: "text-sm font-normal text-blue-gray-500",
                }}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div >
  );
}

export default Home;
