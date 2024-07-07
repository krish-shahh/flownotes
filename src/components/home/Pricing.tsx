import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description:
      "Get a monthly wave of credits to create simulations and mind maps with ease. Perfect for starters looking to dip their toes into FlowNotes' capabilties.",
    benefitList: [
      "10 Simulation Credits",
      "2 Mind Maps",
      "Up to 5 GB Storage",
      "Unlimited Note Pages",
    ],
  },
  {
    title: "Pro",
    popular: 1,
    price: 29.99,
    description:
      "Experience a monthly surge of credits to supercharge your note-taking efforts. Ideal for small to medium-sized projects seeking consistent support.",
    benefitList: [
      "100 Simulation Credits",
      "15 Mind Maps",
      "Up to 20 GB Storage",
      "Unlimited Note Pages",
      "Priority support",
    ],
  },
  {
    title: "Unlimited",
    popular: 0,
    price: 99.99,
    description:
      "Enjoy a monthly torrent of credits flooding your account, empowering you to tackle even the most ambitious note-taking tasks effortlessly.",
    benefitList: [
      "Unlimited Simulation Credits",
      "Unlimited Mind Maps",
      "Unlimited Storage",
      "Unlimited Note Pages",
      "Priority support",
      "Team Member support",
    ],
  },
];

export const Pricing = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-center pt-4 pb-8">
        Pricing
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};