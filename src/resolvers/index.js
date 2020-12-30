const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: ".env" });

//Create token
const createToken = (user) => {
  const { id, email, name } = user;
  const token = jwt.sign({ id, email, name }, process.env.SECRET, {
    expiresIn: "8h",
  });
  return token;
};

const resolvers = {
  Query: {
    getProjects: async (_, {}, ctx) => {
      const projects = await Project.find({ createBy: ctx.user.id });

      return projects;
    },
    getTask: async (_, { input }, ctx) => {
      const tasks = await Task.find({ createBy: ctx.user.id })
        .where("project")
        .equals(input.project);

      return tasks;
    },
    getUser: async (_, { input }, ctx) => {
      const userJwt = jwt.verify(input.token, process.env.SECRET);
      //console.log(user);
      //   const user = await User.find({ _id: userJwt.id });
      console.log("user ==> ", userJwt);
      //return user;

      return userJwt;
    },
  },

  Mutation: {
    createUser: async (root, { input }) => {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Este correo ya esta en uso");
      }

      try {
        //Hash password
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        //Save User db
        const newUser = new User(input);
        newUser.save();

        return {
          token: createToken(newUser),
        };
      } catch (error) {
        console.log("error:createUser", error);
      }
    },
    authUser: async (root, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Lo siento usuario inexistente");
      }

      try {
        //Password correct!
        const passwordCorrect = await bcryptjs.compare(password, user.password);

        if (!passwordCorrect) {
          throw new Error("Lo siento contraseña incorrecta");
        }

        return {
          token: createToken(user),
        };
      } catch (error) {
        console.log("error:authUser", error);
      }
    },
    newProject: async (root, { input }, ctx) => {
      console.log("context =>", ctx);
      try {
        const project = new Project(input);

        project.createBy = ctx.user.id;

        //Save db
        const result = await project.save();

        return result;
      } catch (error) {
        console.log("error:newProject", error);
      }
    },
    updateProject: async (root, { id, input }, ctx) => {
      let project = await Project.findById(id);
      if (!project) {
        throw new Error("Lo siento, el proyecto no existe!");
      }
      if (project.createBy.toString() !== ctx.user.id) {
        throw new Error("Lo siento, no tienes las credenciales para editar");
      }
      //Update Project
      project = await Project.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return project;
    },
    deleteProject: async (root, { id }, ctx) => {
      try {
        let project = await Project.findById(id);
        if (!project) {
          throw new Error("Lo siento, el proyecto no existe!");
        }
        if (project.createBy.toString() !== ctx.user.id) {
          throw new Error(
            "Lo siento, no tienes las credenciales para eliminar"
          );
        }

        //Delete project
        await Project.findOneAndDelete({ _id: id });

        return "Proyecto eliminado satisfactoriamente";
      } catch (error) {
        console.log("error:deleteProject", error);
      }
    },
    newTask: async (root, { input }, ctx) => {
      try {
        const task = new Task(input);
        task.createBy = ctx.user.id;

        const result = await task.save();

        return result;
      } catch (error) {
        console.log("error:newTask", error);
      }
    },
    updateTask: async (root, { id, input, status }, ctx) => {
      let task = await Task.findById(id);
      if (!task) {
        throw new Error("Lo siento, el proyecto no existe!");
      }
      if (task.createBy.toString() !== ctx.user.id) {
        throw new Error("Lo siento, no tienes las credenciales para editar");
      }

      try {
        //Update Task
        input.status = status;
        task = await Task.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return task;
      } catch (error) {
        console.log("error:updateTask", error);
      }
    },
    deleteTask: async (root, { id }, ctx) => {
      try {
        let task = await Task.findById(id);
        if (!task) {
          throw new Error("Lo siento, la tarea no existe!");
        }
        if (task.createBy.toString() !== ctx.user.id) {
          throw new Error(
            "Lo siento, no tienes las credenciales para eliminar"
          );
        }

        //Delete task
        await Task.findOneAndDelete({ _id: id });

        return "Tarea eliminada satisfactoriamente";
      } catch (error) {
        console.log("error:deleteTask", error);
      }
    },
  },
};

module.exports = resolvers;
