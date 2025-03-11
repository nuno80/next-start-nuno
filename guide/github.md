# Git Branch Management

This guide provides a basic overview of managing branches in Git.

## 1. Creating a New Branch

To create a new branch named "development", use the following command:
```
bash
git checkout -b development
```
This command creates a new branch named "development" and immediately switches to it.

```bash

git init
git add .
git commit -m "Initial commit"

#Collega il repository remoto e fai il push:

git branch -M development
git push -u origin development

```

## 2. Switching Between Branches

To switch from one branch to another, use the `git checkout` command followed by the name of the branch you want to switch to.

For example, to switch from the "development" branch to the "main" branch, use:
```
bash
git checkout main
```
## 3. Pulling Changes After Switching

After switching to another branch, it's essential to run `git pull` to ensure your local branch is up to date with the remote branch.
```
bash
git pull origin main
```
This command fetches and integrates changes from the remote repository (`origin`)'s `main` branch into your local `main` branch. This step is important to avoid conflicts and ensure you are working with the latest code.

git pull on main: Updates your local main branch to match the remote main branch.

the brances created will remain separated unless you will perform a merge.

This command fetches and integrates changes from the remote repository (`origin`)'s `main` branch into your local `main` branch. This step is important to avoid conflicts and ensure you are working with the latest code.

## 4. Merging Development into Main

After completing your work in the `development` branch, you'll likely want to merge those changes into the `main` branch. This is typically done when the features or bug fixes in `development` are ready to be integrated into the main codebase. Here's how to do it locally using the `git merge` command:

**Steps:**

1.  **Checkout `main`:**
    *   First, switch to the `main` branch using the `git checkout` command:
    *   This command makes `main` your active branch.
2.  **Ensure `main` is Up-to-Date:**
    * It's a good practice to ensure that your local `main` is up to date with the remote `main` branch before merging. Use the `git pull` command to do so:
3.  **Merge `development` into `main`:**
    *   Now, merge the `development` branch into `main` using the `git merge` command:

```
bash
git checkout main
git pull origin main
git merge development
```

This command takes the changes from `development` and integrates them into `main`.
1.  **Resolve Conflicts (if any):**
    *   If there are any conflicts (changes to the same lines of code in both branches), Git will pause and ask you to resolve them manually. Open the files with conflicts, edit them to keep the correct version, then stage them using `git add` and continue the merge using `git merge --continue`.
2. **Push the changes to remote**
    * After merging is complete, push the changes of main in the remote repository:


**Explanation:**

*   `git checkout main`: Switches the active branch to `main`, so subsequent commands will affect `main`.
*   `git pull origin main`: Updates your local `main` branch to include any changes that might have been made to the remote `main` branch by others. This is very important to avoid conflict as much as possible.
*   `git merge development`: This is the core command that integrates the changes made on the `development` branch into the currently checked-out branch (`main` in this case).
* `git push origin main`: Pushes the main branch to remote.

By following these steps, you successfully integrate your new features or bug fixes from the `development` branch into the `main` branch, keeping your codebase organized and controlled.


 