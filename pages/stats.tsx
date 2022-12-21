import clientPromise from "@lib/mongodb";
import moment from "moment";
import pino from "pino";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      level: "debug",
    },
  },
});

export default function Home({ timeList }: { timeList: number[] }) {
  let newTimeList = timeList.map((changes: number, time: number) => {
    return {
      time,
      changes,
    };
  });
  return (
    <>
      <div>
        <h1 className="text-3xl my-3">
          Vanligste tidspunkt for prisendringer (endringer per time) Total
          changes: {timeList.reduce((a, b) => a + b, 0)}
        </h1>
        <div className="flex w-full overflow-hidden gap-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={newTimeList}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="changes"
                stroke="#8884d8"
                // activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  let prices = await client
    .db("meny")
    .collection("prices")
    .find({}, { projection: { timestamp: 1 } })
    .sort({ timestamp: 1 })
    .toArray();

  let timeList = [];
  for (let i = 0; i < 24; i++) {
    timeList.push(0);
  }
  for (let price in prices.slice(10000)) {
    // TODO: Remove initial prices
    let hour = moment(prices[price].timestamp).hour();
    timeList[hour]++;
  }

  return {
    props: {
      timeList,
    },
    // Revalidate after 10 minutes
    revalidate: 600,
  };
}
