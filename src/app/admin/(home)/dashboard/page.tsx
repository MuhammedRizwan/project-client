'use client';
import {  Card, CardBody } from "@nextui-org/react";
import { Users, MousePointer, ShoppingCart, ThumbsUp } from "lucide-react";
import MetricCard from "@/components/dashboard/metric-card";
import { ReviewProgress } from "@/components/dashboard/review-progress";
import OrderItem from "@/components/dashboard/order-item";
// import { ProjectRow } from "@/components/dashboard/project-row";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric Cards */}
        <MetricCard icon={Users} color="orange-500" title="Users Active" value="1600" percentage="+55%" />
        <MetricCard icon={MousePointer} color="zinc-900" title="Click Events" value="357" percentage="+124%" />
        <MetricCard icon={ShoppingCart} color="zinc-900" title="Purchases" value="2300" percentage="+15%" />
        <MetricCard icon={ThumbsUp} color="zinc-900" title="Likes" value="940" percentage="+90%" />
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          {/* Reviews Section */}
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <ReviewProgress label="Positive Reviews" percentage={80} />
              <ReviewProgress label="Neutral Reviews" percentage={17} />
              <ReviewProgress label="Negative Reviews" percentage={3} />
            </CardBody>
          </Card>

          {/* Projects Table */}
          {/* <Card>
            <CardBody>
              <h2 className="text-xl font-semibold">Projects</h2>
              <Table>
                <TableHeader>
                  <TableColumn>COMPANIES</TableColumn>
                  <TableColumn>MEMBERS</TableColumn>
                  <TableColumn>BUDGET</TableColumn>
                  <TableColumn>COMPLETION</TableColumn>
                </TableHeader>
                <TableBody>
                  <ProjectRow
                    name="Soft UI XD Version"
                    members={["/placeholder.svg", "/placeholder.svg"]}
                    budget="$14,000"
                    completion={60}
                  />
                </TableBody>
              </Table>
            </CardBody>
          </Card> */}
        </div>

        {/* Orders Overview */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold">Orders Overview</h2>
            <OrderItem icon="$" color="green" description="$2400, Design changes" date="22 DEC 7:20 PM" />
            <OrderItem icon="!" color="red" description="New order #1832412" date="21 DEC 11 PM" />
            <OrderItem icon="S" color="blue" description="Server payments for April" date="21 DEC 9:34 PM" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
