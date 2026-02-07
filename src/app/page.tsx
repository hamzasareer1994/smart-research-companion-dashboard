import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
  Badge,
  IconButton
} from "@radix-ui/themes";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FileTextIcon,
  ChatBubbleIcon,
  BarChartIcon,
  QuoteIcon,
  PersonIcon,
  CheckIcon
} from "@radix-ui/react-icons";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <Box>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--gray-5)",
          opacity: 0.9
        }}>
        <Container size="4">
          <Flex align="center" justify="between" height="64px" px="4">
            <Flex align="center" gap="2">
              <IconButton size="2" variant="soft">
                <FileTextIcon />
              </IconButton>
              <Text weight="bold" size="4">Smart Research</Text>
            </Flex>

            <Flex align="center" gap="6" className="hidden md:flex">
              <Link href="#features"><Text size="2" color="gray" className="hover:text-accent-10 transition cursor-pointer">Features</Text></Link>
              <Link href="#pricing"><Text size="2" color="gray" className="hover:text-accent-10 transition cursor-pointer">Pricing</Text></Link>
              <Link href="#about"><Text size="2" color="gray" className="hover:text-accent-10 transition cursor-pointer">About</Text></Link>
            </Flex>

            <Flex align="center" gap="4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" asChild style={{ cursor: 'pointer' }}>
                  <span>Log in</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="solid" asChild style={{ cursor: 'pointer' }}>
                  <span>Get Started</span>
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </nav>

      {/* Hero Section */}
      <Section pt="9" pb="9">
        <Container size="3">
          <Flex direction="column" align="center" gap="6">
            <Badge size="2" variant="soft" radius="full">
              Powered by AI
            </Badge>

            <Heading size="9" weight="bold" align="center">
              Research at the <Text color="indigo">Speed of Thought</Text>
            </Heading>

            <Box maxWidth="600px">
              <Text size="5" color="gray" align="center">
                The AI research assistant designed for elite researchers. From literature review to knowledge graphs,
                all in one seamless interface.
              </Text>
            </Box>

            <Flex gap="4">
              <Link href="/signup">
                <Button size="4" asChild style={{ cursor: 'pointer' }}>
                  <span>Get Started for Free <ArrowRightIcon /></span>
                </Button>
              </Link>
              <Button size="4" variant="outline">
                View Demo
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" style={{ backgroundColor: "var(--gray-2)" }}>
        <Container size="4">
          <Flex direction="column" align="center" mb="9">
            <Heading size="8" mb="3" align="center">Built for the Modern Academic Workflow</Heading>
            <Text color="gray" size="4" align="center">Six features to supercharge your research</Text>
          </Flex>

          <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="6">
            <FeatureCard
              icon={<MagnifyingGlassIcon width="20" height="20" />}
              title="Literature Search"
              description="Search millions of papers across PubMed and arXiv in real-time."
            />
            <FeatureCard
              icon={<BarChartIcon width="20" height="20" />}
              title="Knowledge Graphs"
              description="Visualize connections between papers, authors, and concepts."
            />
            <FeatureCard
              icon={<FileTextIcon width="20" height="20" />}
              title="Data Extraction"
              description="Extract tables, figures, and key findings automatically."
            />
            <FeatureCard
              icon={<ChatBubbleIcon width="20" height="20" />}
              title="Chat with Papers"
              description="Ask questions about your papers and get cited answers."
            />
            <FeatureCard
              icon={<QuoteIcon width="20" height="20" />}
              title="Citation Engine"
              description="Generate citations in APA, MLA, Chicago, and more."
            />
            <FeatureCard
              icon={<PersonIcon width="20" height="20" />}
              title="Writing Assistant"
              description="Draft literature reviews with AI-powered suggestions."
            />
          </Grid>
        </Container>
      </Section>

      {/* Pricing Section */}
      <Section id="pricing">
        <Container size="4">
          <Flex direction="column" align="center" mb="9">
            <Heading size="8" mb="3" align="center">Invest in Your Intelligence</Heading>
            <Text color="gray" size="4" align="center">Simple, transparent pricing</Text>
          </Flex>

          <Grid columns={{ initial: "1", md: "3" }} gap="6">
            <PricingCard
              title="Student"
              price="$0"
              period="/month"
              description="Perfect for getting started"
              features={["100k credits/month", "5 paper uploads", "Basic search", "Community support"]}
              cta="Get Started"
              variant="outline"
            />
            <PricingCard
              title="Academic Pro"
              price="$24"
              period="/month"
              description="For serious researchers"
              features={["1.5M credits/month", "Unlimited uploads", "Advanced search", "Priority support", "Team collaboration"]}
              cta="Upgrade Now"
              variant="solid"
              popular
            />
            <PricingCard
              title="Research Lab"
              price="$89"
              period="/month"
              description="For research teams"
              features={["Unlimited credits", "API access", "Custom integrations", "Dedicated support", "HIPAA compliance"]}
              cta="Contact Sales"
              variant="outline"
            />
          </Grid>
        </Container>
      </Section>

      {/* Footer */}
      <Section py="8">
        <Container size="4">
          <Flex direction={{ initial: "column", md: "row" }} align="center" justify="between" gap="4">
            <Flex align="center" gap="2">
              <IconButton variant="soft" size="1">
                <FileTextIcon />
              </IconButton>
              <Text size="2" weight="bold">Smart Research Companion</Text>
            </Flex>
            <Text size="2" color="gray">© 2026 Smart Research. All rights reserved.</Text>
          </Flex>
        </Container>
      </Section>
    </Box>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Flex align="center" justify="center" width="40px" height="40px" className="rounded-lg bg-accent-3 text-accent-11">
          {icon}
        </Flex>
        <Box>
          <Heading size="4" mb="1">{title}</Heading>
          <Text size="2" color="gray">{description}</Text>
        </Box>
      </Flex>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  cta,
  variant,
  popular
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: "outline" | "solid";
  popular?: boolean;
}) {
  return (
    <Card size="3" variant={popular ? "classic" : "surface"} style={popular ? { border: "2px solid var(--accent-9)" } : {}}>
      {popular && (
        <Flex justify="center" mb="4">
          <Badge size="2" variant="solid">Most Popular</Badge>
        </Flex>
      )}
      <Heading size="4" mb="1">{title}</Heading>
      <Text size="2" color="gray" mb="4">{description}</Text>

      <Flex align="baseline" gap="1" mb="6">
        <Text size="8" weight="bold">{price}</Text>
        <Text size="2" color="gray">{period}</Text>
      </Flex>

      <Box mb="6">
        <Flex direction="column" gap="3">
          {features.map((feature, i) => (
            <Flex key={i} align="center" gap="2">
              <CheckIcon style={{ color: "var(--green-9)" }} />
              <Text size="2" color="gray">{feature}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      <Button variant={variant} size="3" className="w-full">
        {cta}
      </Button>
    </Card>
  );
}
