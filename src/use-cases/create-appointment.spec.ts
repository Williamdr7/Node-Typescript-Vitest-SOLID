import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointments";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe("Create Appointment", () => {
  it("should be able to crate an appointment", () => {
    const startsAt = getFutureDate("2022-02-10");
    const endsAt = getFutureDate("2022-02-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  it("should not be able to crate an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2022-02-10");
    const endsAt = getFutureDate("2022-02-15");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    await createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-02-14"),
        endsAt: getFutureDate("2022-02-18"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-02-08"),
        endsAt: getFutureDate("2022-02-12"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-02-08"),
        endsAt: getFutureDate("2022-02-20"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-02-12"),
        endsAt: getFutureDate("2022-02-13"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
