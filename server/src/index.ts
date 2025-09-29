import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    fastify.get("/api/health", async (request, reply) => {
      return {
        message: "Fastify server is running!",
        timestamp: new Date().toISOString(),
      };
    });

    const PORT = Number(process.env.PORT) || 3000;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`🚀 Fastify server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
