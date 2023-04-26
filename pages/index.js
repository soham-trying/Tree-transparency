import { IconChevronRight, IconTrees } from "@tabler/icons-react";

export default function Home() {
  return (
    <main>
      <Hero />
      <Statistics />
      <Promo />
    </main>
  );
}

function Hero() {
  return (
    <div className="relative px-6 isolate pt-14 lg:px-8">
      <div className="max-w-2xl py-32 mx-auto sm:py-48 lg:py-56">
        <div className="flex items-center justify-center mb-6">
          <IconTrees size={100} />
        </div>
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative px-3 py-1 text-sm leading-6 rounded-full opacity-70 ring-1 ring-base-content/10 hover:ring-base-content/20">
            Announcing our next round of funding.{" "}
            <a href="#" className="font-semibold text-primary">
              <span className="absolute inset-0" aria-hidden="true" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl">
            Maintain <span className="text-primary">Trees</span> Around You
          </h1>
          <p className="mt-6 text-lg leading-8 text-base-content">
            A web 3.0 platform for maintaining tree transparency
          </p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <a href="#" className="btn btn-primary">
              Get started
            </a>
            <a href="/aboutus" className="gap-2 btn btn-ghost">
              Learn more <IconChevronRight />
            </a>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}

function Promo() {
  return (
    <div className="relative px-6 overflow-hidden">
      <div className="pt-16 pb-80 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative px-4 mx-auto max-w-7xl sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-base-content font sm:text-6xl">
              ADOPT TREES HERE !!!
            </h1>
            <p className="mt-4 text-xl opacity-70">
            The best time to plant a tree was 20 years ago. The second best time is now.
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44 sm:opacity-0 lg:opacity-100">
                        <img
                          src="https://images.unsplash.com/photo-1565721567189-72a61209bb81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjI2fHx0cmVlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1854&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1533579286939-3e7b8bec52f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1528027575047-56782a87e021?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1614183733044-a2bbd68e0b5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://images.unsplash.com/photo-1603976328262-4c1b46d7e6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/adopt"
                className="inline-block px-8 py-3 font-medium text-center text-white duration-300 border border-transparent rounded-md bg-primary hover:opacity-90"
              >
                <p class="italic..."> Click here to adopt</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Statistics() {
  const stats = [
    { id: 1, name: "Transactions every 24 hours", value: "44 million" },
    { id: 2, name: "Assets under holding", value: "$119 trillion" },
    { id: 3, name: "New users annually", value: "46,000" },
  ];

  return (
    <div className="pb-24 sm:pb-32">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <dl className="grid grid-cols-1 text-center gap-x-8 gap-y-16 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col max-w-xs mx-auto gap-y-4"
            >
              <dt className="leading-7 text-base-content opacity-70">{stat.name}</dt>
              <div className="order-first text-3xl font-semibold tracking-tight text-base-content sm:text-5xl">
                {stat.value}
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
