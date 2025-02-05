import { renderHook, act } from "@testing-library/react";
import { FirestoreError } from "firebase/firestore";
import { useUpdateDemandStatus } from "../../domain/useCase/useUpdateDemandStatus";
import { mockFirestoreUpdate } from "../mocks/firestore-mock";
import * as checkConnectionModule from "../../data/remoteDao/util/checkInternetConnection";

jest.mock("../../data/remoteDao/demandDao", () => ({
  updateDemandStatus: jest.fn(),
}));

jest.mock("../../data/remoteDao/util/checkInternetConnection");

describe("useUpdateDemandStatus hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should handle no internet connection gracefully", async () => {
    const mockCheckInternetConnection = jest
      .spyOn(checkConnectionModule, "checkInternetConnection")
      .mockResolvedValue(false);

    const { result } = renderHook(() => useUpdateDemandStatus());

    await act(async () => {
      const success = await result.current.updateStatus(
        "demand123",
        "pending",
        "placed"
      );
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe(
      "אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב."
    );
    expect(mockCheckInternetConnection).toHaveBeenCalled();
  });

  test("should proceed with the update when internet is connected", async () => {
    jest
      .spyOn(checkConnectionModule, "checkInternetConnection")
      .mockResolvedValue(true);

    const mockUpdateDemandStatus = jest.fn().mockResolvedValue(true);
    jest.mock("../../data/remoteDao/demandDao", () => ({
      updateDemandStatus: mockUpdateDemandStatus,
    }));

    const { result } = renderHook(() => useUpdateDemandStatus());

    await act(async () => {
      const success = await result.current.updateStatus(
        "demand123",
        "pending",
        "placed"
      );
      expect(success).toBe(true);
    });
  });
});
