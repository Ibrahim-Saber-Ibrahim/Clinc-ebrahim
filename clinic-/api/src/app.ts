import express from "express";
import cors from "cors";
import branchRouter from "./routes/branch.routes";
import doctorRouter from "./routes/doctor.routes";
import userRouter from "./routes/user.routes";
import appointmentRouter from "./routes/appointment.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (_request, response) => {
  response.json({ success: true, message: "API is running" });
});

app.use("/api/branches", branchRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);

export default app;
