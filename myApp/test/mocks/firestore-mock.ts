import { updateDemandStatus } from "../../data/remoteDao/demandDao";


export const mockFirestoreUpdate = (success: boolean) => {
  (updateDemandStatus as jest.Mock).mockImplementation(() => {
    if (success) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Firestore update failed"));
    }
  });
};
