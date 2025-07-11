/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://sap.github.io/openui5-sample-app/", "timeout": 200 }
 */

/*
 ** This is a convertion from QUnit to Vitest.
 ** Original Qunit test can be found at:
 ** https://github.com/SAP/openui5-sample-app/blob/8ff64b428886c498e6688b14fe09b096854ec71a/webapp/controller/App.controller.js
 */

import {
  expect,
  describe,
  beforeEach,
  afterEach,
  vi,
  it,
  beforeAll,
} from "vitest";

let AppController;
let JSONModel;
let oAppController;

describe("App.controller.js", () => {
  beforeAll(async () => {
    return new Promise<void>((resolve) => {
      sap.ui.require(
        [
          "sap/ui/model/json/JSONModel",
          "sap/ui/demo/todo/controller/App.controller",
        ],
        function (JSONModelRef, AppControllerRef) {
          JSONModel = JSONModelRef;
          AppController = AppControllerRef;
          resolve();
        },
      );
    });
  });

  beforeEach(() => {
    oAppController = new AppController();
  });

  afterEach(() => {
    oAppController.destroy();
  });

  it("getI18NKey", () => {
    expect(oAppController.getI18NKey()).toBe(undefined);
    expect(oAppController.getI18NKey(undefined, "My Todo")).toBe(
      "ITEMS_CONTAINING",
    );
    expect(oAppController.getI18NKey("all")).toBe(undefined);
    expect(oAppController.getI18NKey("active")).toBe("ACTIVE_ITEMS");
    expect(oAppController.getI18NKey("active", "My Todo")).toBe(
      "ACTIVE_ITEMS_CONTAINING",
    );
    expect(oAppController.getI18NKey("completed")).toBe("COMPLETED_ITEMS");
    expect(oAppController.getI18NKey("completed", "My Todo")).toBe(
      "COMPLETED_ITEMS_CONTAINING",
    );
  });

  it("removeCompletedTodos", () => {
    const aTodos = [
      { title: "My Todo", completed: false },
      { title: "My Todo 2", completed: false },
    ];
    oAppController.removeCompletedTodos(aTodos);
    expect(aTodos).toEqual([
      { title: "My Todo", completed: false },
      { title: "My Todo 2", completed: false },
    ]);

    aTodos[1].completed = true;
    oAppController.removeCompletedTodos(aTodos);
    expect(aTodos).toEqual([{ title: "My Todo", completed: false }]);
  });

  it("getTodos", () => {
    // Prepare
    const oViewStub = {};
    oViewStub.getModel = () => {
      return new JSONModel();
    };
    // Using vi.spyOn for stubbing methods on existing objects
    const oGetViewStub = vi.spyOn(oAppController, "getView");
    oGetViewStub.mockReturnValue(oViewStub); // Use mockReturnValue for the stubbed return value

    // Act
    expect(oAppController.getTodos()).toEqual([]);

    // Clean-up (vi.spyOn automatically restores mocks after each test if used with describe/it blocks)
    // oGetViewStub.mockRestore(); // Not strictly necessary if using beforeEach/afterEach with describe
  });
});
