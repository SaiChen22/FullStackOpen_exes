// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Blog app", () => {
  // 在每个测试运行前执行登录操作
  test.beforeEach(async ({ page, request }) => {
    await request.post("api/testing/reset");
    await request.post("api/users", {
      data: {
        username: "root",
        name: "Root User",
        password: "secret",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test('blogs are displayed', async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.locator('input[name="username"]').fill("root");
    await page.locator('input[name="password"]').fill("secret");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });

  test("wrong credentials result in an error message", async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.locator('input[name="username"]').fill("root");
    await page.locator('input[name="password"]').fill("wrong");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Wrong username or password")).toBeVisible();
  });



  test.describe("When logged in", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173/login');
      await page.locator('input[name="username"]').fill("root");
      await page.locator('input[name="password"]').fill("secret");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });
    test("logined in user can create a new blog", async ({ page }) => {
      await page.goto('http://localhost:5173/create');

      await page.locator('input[name="title"]').fill("Test Blog");
      await page.locator('input[name="author"]').fill("Test Author");
      await page.locator('input[name="url"]').fill("https://test.com");
      await page.getByRole("button", { name: "create" }).click();

      await expect(page.getByText("Test Blog by Test Author")).toBeVisible();
    });


    test("a blog can be liked", async ({ page }) => {
      await page.goto('http://localhost:5173/create');

      await page.locator('input[name="title"]').fill("Liked Blog");
      await page.locator('input[name="author"]').fill("Blog Author");
      await page.locator('input[name="url"]').fill("https://liked.example.com");
      await page.getByRole("button", { name: "create" }).click();

      await expect(page.getByText("Liked Blog by Blog Author")).toBeVisible();
      await page.getByText("Liked Blog by Blog Author").click();
      await expect(page.getByText("likes 0")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("the user who added a blog can delete it", async ({ page }) => {
      await page.goto('http://localhost:5173/create');
      

      await page.locator('input[name="title"]').fill("Deletable Blog");
      await page.locator('input[name="author"]').fill("Blog Author");
      await page.locator('input[name="url"]').fill("https://delete.example.com");
      await page.getByRole("button", { name: "create" }).click();

      await expect(page.getByText("Deletable Blog by Blog Author")).toBeVisible();
      await page.getByText("Deletable Blog by Blog Author").click();
      await expect(page.getByRole("heading", { name: "Deletable Blog" })).toBeVisible();

      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.getByRole("button", { name: "delete" }).click();

      await expect(page.getByText("Deletable Blog by Blog Author")).not.toBeVisible();
    });

  });
});
